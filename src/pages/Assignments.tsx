import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ClipboardCheck, Clock, CheckCircle2, AlertCircle, Send, UserPlus, X, Search, Check, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { mockStudents, Student } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

interface AssignmentForm {
  title: string;
  targetType: 'all' | 'individual';
  studentId?: string;
}

export default function Assignments() {
  const { user, userType } = useAuth();
  const loggedInStudent = userType === 'student' ? user as unknown as Student : null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<AssignmentForm>({ title: '', targetType: 'all' });
  
  const initialAssignments = useMemo(() => 
    mockStudents.flatMap(s => s.assignments.map(a => ({ ...a, studentName: s.name, studentId: s.id })))
  , []);

  const [assignments, setAssignments] = useState(initialAssignments);
  const [searchTerm, setSearchTerm] = useState('');

  const displayAssignments = useMemo(() => {
    let list = assignments;
    if (loggedInStudent) {
      list = list.filter(a => a.studentId === loggedInStudent.id);
    }
    return list.filter(a => 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [assignments, loggedInStudent, searchTerm]);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    const newAssignments: any[] = [];
    if (form.targetType === 'all') {
      mockStudents.forEach(student => {
        newAssignments.push({
          id: Math.random().toString(36).substr(2, 9),
          title: form.title,
          status: 'pending' as const,
          studentName: student.name,
          studentId: student.id
        });
      });
    } else if (form.studentId) {
      const student = mockStudents.find(s => s.id === form.studentId);
      if (student) {
        newAssignments.push({
          id: Math.random().toString(36).substr(2, 9),
          title: form.title,
          status: 'pending' as const,
          studentName: student.name,
          studentId: student.id
        });
      }
    }

    setAssignments([...newAssignments, ...assignments]);
    setIsModalOpen(false);
    setForm({ title: '', targetType: 'all' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-800">
            {loggedInStudent ? `Bài tập của ${loggedInStudent.name}` : 'Quản lý bài tập'}
          </h1>
          <p className="text-gray-500">
            {loggedInStudent ? 'Hoàn thành các bài tập được giao để tích lũy điểm số.' : 'Giao bài và theo dõi trạng thái hoàn thành.'}
          </p>
        </div>
        {!loggedInStudent && (
          <div className="flex gap-4">
            <button 
              onClick={() => { setForm({ ...form, targetType: 'individual' }); setIsModalOpen(true); }}
              className="px-6 py-3 bg-white text-gray-600 font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Giao bài lẻ
            </button>
            <button 
              onClick={() => { setForm({ ...form, targetType: 'all' }); setIsModalOpen(true); }}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Giao bài cả lớp
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {loggedInStudent ? 'Danh sách bài tập cần làm' : 'Danh sách bài tập đã giao'}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
          <div className="space-y-4">
            {displayAssignments.map((assignment, i) => (
              <motion.div
                key={`${assignment.id}-${assignment.studentName}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    assignment.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    <ClipboardCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{assignment.title}</h3>
                    {!loggedInStudent && (
                      <p className="text-xs text-gray-400">Học sinh: <span className="font-bold text-gray-600">{assignment.studentName}</span></p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${
                    assignment.status === 'completed' 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-orange-50 text-orange-600'
                  }`}>
                    {assignment.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {assignment.status === 'completed' ? 'Đã hoàn thành' : 'Đang làm'}
                  </div>
                  {loggedInStudent && assignment.status === 'pending' && (
                    <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all">
                      Làm bài ngay
                    </button>
                  )}
                  {!loggedInStudent && (
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                      <AlertCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Thống kê nhanh</h2>
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            
            <div className="relative z-10 space-y-6">
              <div>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Tỉ lệ hoàn thành</p>
                <p className="text-5xl font-black">78%</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-indigo-100">Đã nộp bài</span>
                  <span className="font-bold">12/15</span>
                </div>
                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[78%] rounded-full" />
                </div>
              </div>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-indigo-100 italic">"Lớp học đang có tiến độ rất tốt, hãy duy trì nhé!"</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-sm">Cần nhắc nhở</h3>
            <div className="space-y-3">
              {mockStudents.filter(s => s.assignments.some(a => a.status === 'pending')).slice(0, 2).map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">
                      {s.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-gray-700">{s.name}</span>
                  </div>
                  <button className="text-[10px] font-bold text-indigo-600 uppercase hover:underline">Nhắc nhở</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Giao bài tập mới</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <form onSubmit={handleAssign} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tên bài tập</label>
                    <input 
                      type="text" 
                      placeholder="VD: Phân tích bài thơ Tây Tiến"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-5 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 rounded-2xl transition-all outline-none font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Đối tượng</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, targetType: 'all' })}
                        className={cn(
                          "py-4 rounded-2xl font-bold transition-all border-2",
                          form.targetType === 'all' 
                            ? "bg-indigo-50 border-indigo-600 text-indigo-600" 
                            : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                        )}
                      >
                        Cả lớp
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, targetType: 'individual' })}
                        className={cn(
                          "py-4 rounded-2xl font-bold transition-all border-2",
                          form.targetType === 'individual' 
                            ? "bg-indigo-50 border-indigo-600 text-indigo-600" 
                            : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                        )}
                      >
                        Cá nhân
                      </button>
                    </div>
                  </div>

                  {form.targetType === 'individual' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Chọn học sinh</label>
                      <select 
                        value={form.studentId}
                        onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 rounded-2xl transition-all outline-none font-medium appearance-none"
                        required
                      >
                        <option value="">-- Chọn học sinh --</option>
                        {mockStudents.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 mt-4"
                  >
                    <Check className="w-6 h-6" />
                    Xác nhận giao bài
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
