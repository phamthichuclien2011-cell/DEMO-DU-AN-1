import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';

export type UserType = 'student' | 'teacher' | 'parent' | null;

export interface AppUser {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: 'student' | 'admin' | 'parent';
  photoURL?: string;
  score?: number;
  rank?: number;
  badges?: string[];
  school?: string;
}

interface AuthContextType {
  user: AppUser | null;
  userType: UserType;
  loginWithGoogle: () => Promise<void>;
  loginWithCredentials: (identifier: string, password: string) => Promise<void>;
  registerWithCredentials: (name: string, username: string, email: string, password: string, role?: 'student' | 'parent') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        let appUser: AppUser;
        if (userDoc.exists()) {
          appUser = { id: userDoc.id, ...userDoc.data() } as AppUser;
        } else {
          // Default admin email
          const isAdmin = firebaseUser.email === 'phamthichuclien2011@gmail.com';
          appUser = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Học sinh',
            email: firebaseUser.email || '',
            role: isAdmin ? 'admin' : 'student',
            photoURL: firebaseUser.photoURL || '',
            score: 0,
            rank: 999,
            badges: [],
            school: 'Chưa cập nhật'
          };
          await setDoc(userDocRef, appUser);
        }
        
        setUser(appUser);
        if (appUser.role === 'admin') {
          setUserType('teacher');
        } else if (appUser.role === 'parent') {
          setUserType('parent');
        } else {
          setUserType('student');
        }
      } else {
        setUser(null);
        setUserType(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const loginWithCredentials = async (identifier: string, password: string) => {
    try {
      let emailToLogin = identifier;
      
      // Nếu không có ký tự @, coi như đăng nhập bằng username (tên đăng nhập)
      if (!identifier.includes('@')) {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', identifier));
        
        let querySnapshot;
        try {
          querySnapshot = await getDocs(q);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'users');
          return; // Sẽ không bao giờ chạy đến đây vì handleFirestoreError đã throw
        }
        
        if (querySnapshot.empty) {
          throw new Error('Không tìm thấy người dùng với tên đăng nhập này.');
        }
        
        // Lấy email của người dùng đầu tiên khớp username
        emailToLogin = querySnapshot.docs[0].data().email;
      }
      
      await signInWithEmailAndPassword(auth, emailToLogin, password);
    } catch (error: any) {
      console.error("Error signing in with credentials", error);
      throw error;
    }
  };

  const registerWithCredentials = async (name: string, username: string, email: string, password: string, role: 'student' | 'parent' = 'student') => {
    try {
      // Kiểm tra xem username đã tồn tại chưa
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username));
      
      let querySnapshot;
      try {
        querySnapshot = await getDocs(q);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'users');
        return;
      }
      
      if (!querySnapshot.empty) {
        throw new Error('Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên đăng nhập khác.');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Tạo document user trong Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      const appUser: AppUser = {
        id: userCredential.user.uid,
        name: name,
        username: username,
        email: email,
        role: role,
        photoURL: '',
        score: 0,
        rank: 999,
        badges: [],
        school: 'Chưa cập nhật'
      };
      
      try {
        await setDoc(userDocRef, appUser);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${userCredential.user.uid}`);
      }

    } catch (error: any) {
      console.error("Error registering with credentials", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userType, loginWithGoogle, loginWithCredentials, registerWithCredentials, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
