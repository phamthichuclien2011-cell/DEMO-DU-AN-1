import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Users, Award, TrendingUp, Search, Filter, School, GraduationCap } from 'lucide-react';
import { Student } from '../data/mockData';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function ParentView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Thành tích học sinh</h1>
          </div>
          <p className="text-gray-500">Xem bảng điểm và thành tích của các học sinh trong hệ thống.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tổng số học sinh</p>
            <p className="text-2xl font-bold text-gray-800">{students.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-2xl text-green-600">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Điểm trung bình hệ thống</p>
            <p className="text-2xl font-bold text-gray-800">850</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tỷ lệ hoàn thành</p>
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
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
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
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">
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
                        <span key={badge} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold border border-indigo-100">
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
    </div>
  );
}
