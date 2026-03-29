import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, FileText, TrendingUp, Users, Award, Clock, Star, Zap, Target, Database } from 'lucide-react';
import { mockLessons, mockStudents, mockQuestions, mockResources, Student, Lesson } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, writeBatch, doc } from 'firebase/firestore';
import { formatDisplayName } from '../lib/formatName';

export default function Dashboard() {
  const { user, userType } = useAuth();
  const loggedInStudent = userType === 'student' ? user as any : null;
  
  const [students, setStudents] = useState<Student[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      const sList: Student[] = [];
      snapshot.forEach((doc) => sList.push({ id: doc.id, ...doc.data() } as Student));
      setStudents(sList);
    });

    const unsubLessons = onSnapshot(collection(db, 'lessons'), (snapshot) => {
      const lList: Lesson[] = [];
      snapshot.forEach((doc) => lList.push({ id: doc.id, ...doc.data() } as Lesson));
      setLessons(lList);
    });

    return () => {
      unsubStudents();
      unsubLessons();
    };
  }, []);

  const handleSeedData = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn nạp dữ liệu mẫu? Thao tác này sẽ thêm dữ liệu vào Firestore.')) return;
    setIsSeeding(true);
    try {
      const batch = writeBatch(db);
      
      mockStudents.forEach(s => {
        const ref = doc(collection(db, 'students'));
        batch.set(ref, s);
      });
      
      mockLessons.forEach(l => {
        const ref = doc(collection(db, 'lessons'));
        batch.set(ref, l);
      });

      mockQuestions.forEach(q => {
        const ref = doc(collection(db, 'questions'));
        batch.set(ref, q);
      });

      mockResources.forEach(r => {
        const ref = doc(collection(db, 'resources'));
        batch.set(ref, r);
      });

      await batch.commit();
      alert('Nạp dữ liệu mẫu thành công!');
    } catch (error) {
      console.error("Error seeding data:", error);
      alert('Có lỗi xảy ra khi nạp dữ liệu.');
    }
    setIsSeeding(false);
  };

  const stats = [
    { label: 'Học sinh', value: students.length || '0', icon: Users, color: 'bg-blue-500' },
    { label: 'Bài tập hoàn thành', value: '85%', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Huy hiệu đã trao', value: students.reduce((acc, s) => acc + (s.badges?.length || 0), 0), icon: Award, color: 'bg-purple-500' },
    { label: 'Giờ học tích lũy', value: '12.5k', icon: Clock, color: 'bg-orange-500' },
  ];

  const studentStats = [
    { label: 'Điểm của em', value: loggedInStudent?.score || 0, icon: Star, color: 'bg-yellow-500' },
    { label: 'Xếp hạng', value: `#${loggedInStudent?.rank || '-'}`, icon: Target, color: 'bg-indigo-500' },
    { label: 'Huy hiệu', value: loggedInStudent?.badges?.length || 0, icon: Award, color: 'bg-purple-500' },
    { label: 'Bài tập chưa làm', value: loggedInStudent?.assignments?.filter((a: any) => a.status === 'pending').length || 0, icon: Zap, color: 'bg-orange-500' },
  ];

  const parentStats = [
    { label: 'Tổng số học sinh', value: students.length || '0', icon: Users, color: 'bg-blue-500' },
    { label: 'Điểm trung bình', value: '850', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Huy hiệu hệ thống', value: students.reduce((acc, s) => acc + (s.badges?.length || 0), 0), icon: Award, color: 'bg-purple-500' },
    { label: 'Tỷ lệ hoàn thành', value: '92%', icon: Zap, color: 'bg-orange-500' },
  ];

  const displayStats = userType === 'student' ? studentStats : (userType === 'parent' ? parentStats : stats);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-gray-800">
            {userType === 'student' ? `Chào buổi sáng, ${formatDisplayName(user as any) || 'Học sinh'}! 👋` : 
             userType === 'parent' ? `Chào buổi sáng, Phụ huynh ${formatDisplayName(user as any) || ''}! 👋` :
             `Chào buổi sáng, ${formatDisplayName(user as any) || 'Quản trị viên'}! 👋`}
          </h1>
          <p className="text-gray-500">Hôm nay là một ngày tuyệt vời để khám phá kiến thức mới.</p>
        </div>
        {userType === 'teacher' && (
          <button 
            onClick={handleSeedData}
            disabled={isSeeding}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Database className="w-4 h-4" />
            {isSeeding ? 'Đang nạp...' : 'Nạp dữ liệu mẫu'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg shadow-${stat.color.split('-')[1]}-100`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Bài giảng mới nhất</h2>
            <button className="text-purple-600 font-bold text-sm hover:underline">Xem tất cả</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessons.map((lesson, i) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className="relative h-40 overflow-hidden">
                  <img src={lesson.thumbnail} alt={lesson.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-125 transition-transform">
                      <Play className="text-white fill-white w-6 h-6" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-purple-600">
                    {lesson.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">{lesson.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>12 Tài liệu</span>
                    </div>
                    <span>15 phút</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {lessons.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-400">
                <p>Chưa có bài giảng nào. Hãy nạp dữ liệu mẫu.</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Bảng xếp hạng</h2>
            <Award className="text-orange-500 w-5 h-5" />
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            {students.sort((a, b) => b.score - a.score).slice(0, 5).map((student, i) => (
              <div key={student.id} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  i === 0 ? 'bg-yellow-100 text-yellow-600' : 
                  i === 1 ? 'bg-gray-100 text-gray-600' : 
                  i === 2 ? 'bg-orange-100 text-orange-600' : 'text-gray-400'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm">{student.name}</p>
                  <p className="text-xs text-gray-400">{student.score} điểm</p>
                </div>
                <div className="flex gap-1">
                  {student.badges?.slice(0, 1).map(badge => (
                    <span key={badge} className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {students.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">Chưa có học sinh nào.</p>
            )}
            <button className="w-full py-3 bg-gray-50 text-gray-500 font-bold text-sm rounded-2xl hover:bg-gray-100 transition-colors mt-4">
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
