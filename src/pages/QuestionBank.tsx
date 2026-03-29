import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit2, Trash2, Database, Tag, X } from 'lucide-react';
import { Question } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function QuestionBank() {
  const { userType } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'questions'), (snapshot) => {
      const qList: Question[] = [];
      snapshot.forEach((doc) => {
        qList.push({ id: doc.id, ...doc.data() } as Question);
      });
      setQuestions(qList);
    });
    return () => unsubscribe();
  }, []);

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
    category: 'Văn học'
  });

  const categories = ['Tất cả', ...Array.from(new Set(questions.map(q => q.category)))];

  const deleteQuestion = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'questions', id));
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const questionToAdd = {
        type: newQuestion.type,
        question: newQuestion.question || '',
        options: newQuestion.type === 'multiple-choice' ? newQuestion.options?.filter(o => o.trim() !== '') : [],
        answer: newQuestion.answer || '',
        explanation: newQuestion.explanation || '',
        category: newQuestion.category || 'Chung'
      };
      await addDoc(collection(db, 'questions'), questionToAdd);
      setIsAddModalOpen(false);
      setNewQuestion({
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        answer: '',
        explanation: '',
        category: 'Văn học'
      });
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(newQuestion.options || [])];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Tất cả' || q.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple-choice': return 'Trắc nghiệm';
      case 'fill-in-the-blank': return 'Điền khuyết';
      case 'short-answer': return 'Trả lời ngắn';
      case 'paragraph': return 'Viết đoạn văn';
      case 'essay': return 'Viết bài văn';
      default: return type;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-800">Ngân hàng câu hỏi</h1>
          <p className="text-gray-500">Quản lý và tạo mới các câu hỏi cho bài kiểm tra.</p>
        </div>
        {userType === 'teacher' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tạo câu hỏi mới
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo nội dung câu hỏi..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.slice(0, 5).map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                cat === selectedCategory ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredQuestions.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Database className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {getTypeLabel(q.type)}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Tag className="w-3 h-3" />
                      <span className="text-xs font-bold">{q.category}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 leading-snug">{q.question}</h3>
                  <p className="text-sm text-gray-500 italic">Đáp án: <span className="text-green-600 font-bold">{q.answer || '(Tự luận)'}</span></p>
                </div>
              </div>
              {userType === 'teacher' && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteQuestion(q.id)}
                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="text-2xl font-bold text-gray-800">Tạo câu hỏi mới</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <form id="add-question-form" onSubmit={handleAddQuestion} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Loại câu hỏi</label>
                      <select
                        value={newQuestion.type}
                        onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value as Question['type'] })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                        required
                      >
                        <option value="multiple-choice">Trắc nghiệm</option>
                        <option value="short-answer">Trả lời ngắn</option>
                        <option value="paragraph">Viết đoạn văn</option>
                        <option value="essay">Viết bài văn</option>
                        <option value="fill-in-the-blank">Điền khuyết</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Chủ đề / Phân loại</label>
                      <input
                        type="text"
                        value={newQuestion.category}
                        onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="VD: Văn học trung đại"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Nội dung câu hỏi</label>
                    <textarea
                      value={newQuestion.question}
                      onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none min-h-[100px]"
                      placeholder="Nhập nội dung câu hỏi..."
                      required
                    />
                  </div>

                  {newQuestion.type === 'multiple-choice' && (
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-gray-700">Các lựa chọn đáp án</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(newQuestion.options || ['', '', '', '']).map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-sm font-bold text-gray-500">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(idx, e.target.value)}
                              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                              placeholder={`Lựa chọn ${idx + 1}`}
                              required
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">
                      {newQuestion.type === 'multiple-choice' || newQuestion.type === 'short-answer' || newQuestion.type === 'fill-in-the-blank' 
                        ? 'Đáp án đúng' 
                        : 'Gợi ý đáp án / Yêu cầu chấm điểm'}
                    </label>
                    {newQuestion.type === 'multiple-choice' ? (
                      <select
                        value={newQuestion.answer}
                        onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                        required
                      >
                        <option value="">-- Chọn đáp án đúng --</option>
                        {newQuestion.options?.filter(o => o.trim() !== '').map((opt, idx) => (
                          <option key={idx} value={opt}>{String.fromCharCode(65 + idx)}: {opt}</option>
                        ))}
                      </select>
                    ) : (
                      <textarea
                        value={newQuestion.answer}
                        onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none min-h-[80px]"
                        placeholder="Nhập đáp án hoặc hướng dẫn chấm..."
                        required={newQuestion.type !== 'paragraph' && newQuestion.type !== 'essay'}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Giải thích (Tùy chọn)</label>
                    <textarea
                      value={newQuestion.explanation}
                      onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none min-h-[80px]"
                      placeholder="Giải thích chi tiết cho đáp án..."
                    />
                  </div>
                </form>
              </div>
              
              <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  form="add-question-form"
                  className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Lưu câu hỏi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
