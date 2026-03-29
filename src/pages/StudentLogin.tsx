import { motion } from 'motion/react';
import { UserCircle, LogIn, CheckCircle2, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function StudentLogin() {
  const { user, userType, loginWithGoogle, loginWithCredentials, registerWithCredentials, logout } = useAuth();
  const loggedInStudent = userType === 'student' ? user : null;
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'parent'>('student');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/configuration-not-found') {
        setError('Chưa bật đăng nhập bằng Google. Vui lòng vào Firebase Console -> Authentication -> Sign-in method -> Thêm Google -> Bật và Lưu.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(`Tên miền chưa được cấp quyền. Vui lòng thêm "${window.location.hostname}" vào danh sách Authorized domains trong Firebase Console (Authentication -> Settings -> Authorized domains).`);
      } else if (err.code === 'auth/network-request-failed') {
        setError('Lỗi kết nối Firebase (Network Request Failed). Điều này thường do cấu hình trong firebase.ts chưa chính xác hoặc tên miền này chưa được thêm vào "Authorized domains" trong Firebase Console.');
      } else {
        setError('Đã xảy ra lỗi khi đăng nhập: ' + err.message);
      }
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isRegistering) {
        if (!name || !username || !email || !password) {
          throw new Error('Vui lòng điền đầy đủ thông tin.');
        }
        await registerWithCredentials(name, username, email, password, role);
      } else {
        if (!identifier || !password) {
          throw new Error('Vui lòng điền đầy đủ thông tin.');
        }
        await loginWithCredentials(identifier, password);
      }
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Thông tin đăng nhập không chính xác.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Email này đã được sử dụng.');
      } else if (err.code === 'auth/weak-password') {
        setError('Mật khẩu quá yếu (cần ít nhất 6 ký tự).');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Lỗi kết nối Firebase (Network Request Failed). Điều này thường do cấu hình trong firebase.ts chưa chính xác hoặc tên miền này chưa được thêm vào "Authorized domains" trong Firebase Console.');
      } else {
        setError(err.message || 'Đã xảy ra lỗi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-indigo-600"
        >
          <UserCircle className="w-12 h-12" />
        </motion.div>
        <h1 className="text-4xl font-black text-gray-800 mb-4 tracking-tight">Cổng Đăng Nhập EduQuest</h1>
        <p className="text-gray-500 text-lg">Đăng nhập để bắt đầu hành trình chinh phục tri thức!</p>
      </div>

      {loggedInStudent ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center max-w-lg mx-auto"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 overflow-hidden">
            {loggedInStudent.photoURL ? (
              <img src={loggedInStudent.photoURL} alt={loggedInStudent.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <CheckCircle2 className="w-12 h-12" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chào mừng, {loggedInStudent.name}!</h2>
          <p className="text-gray-500 mb-8">Em đang đăng nhập thành công. Hãy bắt đầu làm bài tập nhé!</p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/knowledge')}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              Đến trang Kho tri thức
            </button>
            <button 
              onClick={logout}
              className="w-full py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
            >
              Đăng xuất tài khoản
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6 max-w-md mx-auto">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
              <p className="font-bold mb-1">Lỗi đăng nhập:</p>
              <p>{error}</p>
              {error.includes('Authorized domains') && (
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.hostname);
                    alert('Đã copy tên miền: ' + window.location.hostname);
                  }}
                  className="mt-2 text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded font-bold transition-colors"
                >
                  Copy tên miền này
                </button>
              )}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-100 shadow-xl"
          >
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setIsRegistering(false)}
                className={`flex-1 py-3 font-bold rounded-xl transition-all ${!isRegistering ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Đăng nhập
              </button>
              <button
                onClick={() => setIsRegistering(true)}
                className={`flex-1 py-3 font-bold rounded-xl transition-all ${isRegistering ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Đăng ký
              </button>
            </div>

            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              {isRegistering ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bạn là ai?</label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${role === 'student' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-500'}`}
                      >
                        Học sinh
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('parent')}
                        className={`flex-1 py-3 rounded-xl border-2 font-bold transition-all ${role === 'parent' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-500'}`}
                      >
                        Phụ huynh
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Họ và tên</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tên đăng nhập (Username)</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="nguyenvana123"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email hoặc Tên đăng nhập</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Nhập email hoặc tên đăng nhập..."
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 flex justify-center items-center gap-2 mt-6"
              >
                {isLoading ? 'Đang xử lý...' : (isRegistering ? 'Đăng ký tài khoản' : 'Đăng nhập')}
                {!isLoading && <LogIn className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">Hoặc</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full mt-6 bg-white p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group flex items-center justify-center gap-3"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
              <span className="font-bold text-gray-700 group-hover:text-indigo-700">Tiếp tục với Google</span>
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
