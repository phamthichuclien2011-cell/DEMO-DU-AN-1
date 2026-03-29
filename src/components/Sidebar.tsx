import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ClipboardCheck, 
  Gamepad2, 
  Database,
  UserCircle,
  GraduationCap
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { userType } = useAuth();

  const navItems = [
    { name: 'Đăng nhập', path: '/student-login', icon: UserCircle, show: !userType },
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, show: userType !== 'parent' },
    { name: 'Thành tích học sinh', path: '/parent-view', icon: GraduationCap, show: userType === 'parent' },
    { name: 'Kho tri thức Ngữ văn', path: '/knowledge', icon: BookOpen, show: userType !== 'parent' },
    { name: 'Học sinh', path: '/students', icon: Users, show: userType === 'teacher' },
    { name: 'Bài tập', path: '/assignments', icon: ClipboardCheck, show: userType !== 'parent' },
    { name: 'Trò chơi', path: '/game', icon: Gamepad2, show: userType !== 'parent' },
    { name: 'Ngân hàng câu hỏi', path: '/bank', icon: Database, show: userType === 'teacher' },
    { name: 'Dữ liệu nguồn', path: '/source-data', icon: Database, show: userType === 'teacher' },
  ];

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            EduQuest
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.filter(item => item.show).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
                isActive 
                  ? "bg-purple-50 text-purple-600 shadow-sm" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-purple-600"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                isActive ? "text-purple-600" : "text-gray-400 group-hover:text-purple-600"
              )} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
          <p className="text-xs font-bold uppercase tracking-wider opacity-80">Cấp độ 5</p>
          <p className="text-lg font-bold">Siêu nhân học tập</p>
          <div className="w-full bg-white/30 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-white h-full w-3/4 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
