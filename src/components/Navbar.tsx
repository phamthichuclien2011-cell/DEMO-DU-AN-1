import { Bell, Search, UserCircle, LogOut, LogIn, ShieldCheck, GraduationCap, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatDisplayName } from '../lib/formatName';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, userType, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 fixed top-0 right-0 left-64 z-10 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-purple-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm kiếm bài học, câu hỏi..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 rounded-2xl transition-all outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <div className="h-8 w-px bg-gray-200 mx-2" />
        
        {user && (
          <div className={`flex items-center gap-3 p-1 pr-3 rounded-xl border group relative ${
            userType === 'teacher' ? 'bg-purple-50 border-purple-100' : 'bg-indigo-50 border-indigo-100'
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm overflow-hidden ${
              userType === 'teacher' ? 'bg-purple-600' : 'bg-indigo-600'
            }`}>
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                formatDisplayName(user as any).charAt(0)
              )}
            </div>
            <div className="hidden sm:block">
              <p className={`text-sm font-bold ${userType === 'teacher' ? 'text-purple-700' : 'text-indigo-700'}`}>
                {formatDisplayName(user as any)}
              </p>
              <p className={`text-[10px] uppercase font-bold tracking-tighter ${userType === 'teacher' ? 'text-purple-500' : 'text-indigo-500'}`}>
                {userType === 'teacher' ? 'Quản trị viên' : (userType === 'parent' ? 'Phụ huynh' : 'Học sinh')}
              </p>
            </div>
            <button 
              onClick={logout}
              className={`ml-2 p-1.5 rounded-lg transition-all ${
                userType === 'teacher' ? 'text-purple-400 hover:text-red-500 hover:bg-red-50' : 'text-indigo-400 hover:text-red-500 hover:bg-red-50'
              }`}
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
