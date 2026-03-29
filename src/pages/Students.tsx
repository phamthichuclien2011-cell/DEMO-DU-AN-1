import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Award, TrendingUp, Search, Filter, LogOut, X, School, Plus, UserPlus } from 'lucide-react';
import { Student } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';

export default function Students() {
  const { user, userType, logout } = useAuth();
  const loggedInStudent = userType === 'student' ? user as any : null;
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', school: '' });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
      const sList: Student[] = [];
      snapshot.forEach((doc) => sList.push({ id: doc.id, ...doc.data() } as Student));
      setStudents(sList);
    });

    return () => unsubscribe();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.school?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.school) return;

    try {
      await addDoc(collection(db, 'students'), {
        name: newStudent.name,
        school: newStudent.school,
        score: 0,
        rank: students.length + 1,
        badges: [],
        assignments: []
      });
      setNewStudent({ name: '', school: '' });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding student: ", error);
      alert("Có lỗi xảy ra khi thêm học sinh.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý học sinh</h1>
          <p className="text-gray-500">Theo dõi tiến độ và thành tích của lớp học.</p>
        </div>
        {userType === 'teacher' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100"
          >
            <Plus className="w-5 h-5" />
            Thêm học sinh
          </button>
        )}
      </div>

      {loggedInStudent && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600 p-4 rounded-2xl text-white flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold">
              {loggedInStudent.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">Đang đăng nhập với tư cách</p>
              <p className="font-bold">{loggedInStudent.name}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tổng số</p>
            <p className="text-2xl font-bold text-gray-800">{students.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-2xl text-green-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Điểm trung bình</p>
            <p className="text-2xl font-bold text-gray-800">850</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hoàn thành bài tập</p>
            <p className="text-2xl font-bold text-gray-800">92%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Tìm tên học sinh, trường học..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4">Học sinh</th>
                <th className="px-8 py-4">Trường học</th>
                <th className="px-8 py-4">Điểm số</th>
                <th className="px-8 py-4">Xếp hạng</th>
                <th className="px-8 py-4">Huy hiệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student, i) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center text-purple-600 font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-bold text-gray-700">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-gray-500">
                      <School className="w-4 h-4" />
                      <span className="text-sm">{student.school || 'Chưa cập nhật'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-bold text-gray-800">{student.score}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      student.rank === 1 ? 'bg-yellow-100 text-yellow-600' : 
                      student.rank === 2 ? 'bg-gray-100 text-gray-600' : 
                      'bg-orange-100 text-orange-600'
                    }`}>
                      #{student.rank}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex gap-2">
                      {student.badges?.map(badge => (
                        <span key={badge} className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-[10px] font-bold border border-purple-100">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-8 text-center text-gray-400">
                    Không tìm thấy học sinh nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Thêm học sinh mới</h2>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleAddStudent} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Tên học sinh</label>
                    <input 
                      type="text" 
                      required
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      placeholder="Nhập họ và tên..." 
                      className="w-full px-5 py-3 bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-2xl transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Trường học</label>
                    <div className="relative">
                      <School className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input 
                        type="text" 
                        required
                        value={newStudent.school}
                        onChange={(e) => setNewStudent({...newStudent, school: e.target.value})}
                        placeholder="Nhập tên trường..." 
                        className="w-full pl-12 pr-5 py-3 bg-gray-50 border-2 border-transparent focus:border-purple-500 focus:bg-white rounded-2xl transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                      Xác nhận thêm
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Hệ thống học tập thông minh EduQuest
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
