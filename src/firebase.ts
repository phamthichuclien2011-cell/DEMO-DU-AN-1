import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, getDocFromServer, doc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCJDBLKdvgCq_FBIPHXRSf4nmO3t-EUfKE",
  authDomain: "weblms-hocvantot.firebaseapp.com",
  projectId: "weblms-hocvantot",
  storageBucket: "weblms-hocvantot.firebasestorage.app",
  messagingSenderId: "403750667032",
  appId: "1:403750667032:web:78607afcd972eecf3d146d",
  measurementId: "G-1GQ0232K0R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Kiểm tra kết nối Firestore ngay khi khởi động
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Kết nối Firebase thành công!");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("LỖI KẾT NỐI: Vui lòng kiểm tra lại 'Authorized domains' trong Firebase Console.");
    }
  }
}
testConnection();
