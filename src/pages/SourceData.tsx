import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, BookOpen, Plus, Search, Edit2, Trash2, Tag, X, Video, LayoutGrid, Link as LinkIcon, ExternalLink, Play } from 'lucide-react';
import { Question, Resource } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function SourceData() {
  const { userType } = useAuth();
  const [activeTab, setActiveTab] = useState<'questions' | 'knowledge'>('questions');
  
  // Questions State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qSearchQuery, setQSearchQuery] = useState('');
  const [isAddQModalOpen, setIsAddQModalOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    answer: '',
    explanation: '',
    category: 'Văn học'
  });

  // Knowledge State
  const [resources, setResources] = useState<Resource[]>([]);
  const [kSearchQuery, setKSearchQuery] = useState('');
  const [isAddKModalOpen, setIsAddKModalOpen] = useState(false);
  const [newResource, setNewResource] = useState<Partial<Resource>>({
    title: '',
    type: 'link',
    url: '',
    thumbnail: '',
    description: '',
    grade: 6
  });

  useEffect(() => {
    const unsubQ = onSnapshot(collection(db, 'questions'), (snapshot) => {
      const qList: Question[] = [];
      snapshot.forEach((doc) => qList.push({ id: doc.id, ...doc.data() } as Question));
      setQuestions(qList);
    });

    const unsubK = onSnapshot(collection(db, 'resources'), (snapshot) => {
      const rList: Resource[] = [];
      snapshot.forEach((doc) => rList.push({ id: doc.id, ...doc.data() } as Resource));
      setResources(rList);
    });

    return () => {
      unsubQ();
      unsubK();
    };
  }, []);

  // Question Handlers
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
      setIsAddQModalOpen(false);
      setNewQuestion({ type: 'multiple-choice', question: '', options: ['', '', '', ''], answer: '', explanation: '', category: 'Văn học' });
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      try {
        await deleteDoc(doc(db, 'questions', id));
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  // Knowledge Handlers
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resourceToAdd = {
        title: newResource.title || '',
        type: newResource.type,
        url: newResource.url || '',
        thumbnail: newResource.thumbnail || `https://picsum.photos/seed/${Date.now()}/400/250`,
        description: newResource.description || '',
        grade: newResource.grade
      };
      await addDoc(collection(db, 'resources'), resourceToAdd);
      setIsAddKModalOpen(false);
      setNewResource({ title: '', type: 'link', url: '', thumbnail: '', description: '', grade: 6 });
    } catch (error) {
      console.error("Error adding resource:", error);
    }
  };

  const deleteResource = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      try {
        await deleteDoc(doc(db, 'resources', id));
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    }
  };

  const filteredQuestions = questions.filter(q => q.question.toLowerCase().includes(qSearchQuery.toLowerCase()));
  const filteredResources = resources.filter(r => r.title.toLowerCase().includes(kSearchQuery.toLowerCase()));

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

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-red-500" />;
      case 'app': return <LayoutGrid className="w-5 h-5 text-purple-500" />;
      default: return <LinkIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  if (userType !== 'teacher') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600">
          <X className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Truy cập bị từ chối</h2>
        <p className="text-gray-500">Bạn không có quyền truy cập vào trang quản lý dữ liệu nguồn.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Database className="w-8 h-8 text-indigo-600" />
            Quản lý dữ liệu nguồn
          </h1>
          <p className="text-gray-500">Cập nhật câu hỏi và kho tri thức cho hệ thống.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'questions' ? (
            <button 
              onClick={() => setIsAddQModalOpen(true)}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
            >
              <Plus className="w-5 h-5" />
              Thêm câu hỏi
            </button>
          ) : (
            <button 
              onClick={() => setIsAddKModalOpen(true)}
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-100"
            >
              <Plus className="w-5 h-5" />
              Thêm tài liệu
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'questions' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Database className="w-5 h-5" />
          Ngân hàng câu hỏi
        </button>
        <button
          onClick={() => setActiveTab('knowledge')}
          className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'knowledge' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          Kho tri thức
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder={activeTab === 'questions' ? "Tìm kiếm câu hỏi..." : "Tìm kiếm tài liệu..."}
          value={activeTab === 'questions' ? qSearchQuery : kSearchQuery}
          onChange={(e) => activeTab === 'questions' ? setQSearchQuery(e.target.value) : setKSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-4">
        {activeTab === 'questions' ? (
          filteredQuestions.map((q) => (
            <div key={q.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start justify-between group">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                      {getTypeLabel(q.type)}
                    </span>
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {q.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800">{q.question}</h3>
                  <p className="text-sm text-gray-500">Đáp án: <span className="text-green-600 font-bold">{q.answer || '(Tự luận)'}</span></p>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteQuestion(q.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((r) => (
              <div key={r.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group">
                <div className="relative h-40 bg-gray-100">
                  <img src={r.thumbnail} alt={r.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    {getResourceIcon(r.type)}
                    Lớp {r.grade}
                  </div>
                  <button 
                    onClick={() => deleteResource(r.id)}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">{r.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">{r.description}</p>
                  <button className="w-full py-2 bg-gray-50 text-purple-600 text-sm font-bold rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
                    Xem chi tiết
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals (Simplified for brevity, similar to original pages) */}
      <AnimatePresence>
        {isAddQModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Thêm câu hỏi mới</h2>
                <button onClick={() => setIsAddQModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <form id="add-q-form" onSubmit={handleAddQuestion} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Loại câu hỏi</label>
                      <select value={newQuestion.type} onChange={(e) => setNewQuestion({...newQuestion, type: e.target.value as any})} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                        <option value="multiple-choice">Trắc nghiệm</option>
                        <option value="short-answer">Trả lời ngắn</option>
                        <option value="paragraph">Viết đoạn văn</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Chủ đề</label>
                      <input type="text" value={newQuestion.category} onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="VD: Văn học" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Câu hỏi</label>
                    <textarea value={newQuestion.question} onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]" placeholder="Nội dung câu hỏi..." />
                  </div>
                  {newQuestion.type === 'multiple-choice' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">Các lựa chọn</label>
                      <div className="grid grid-cols-2 gap-2">
                        {newQuestion.options?.map((opt, idx) => (
                          <input key={idx} type="text" value={opt} onChange={(e) => {
                            const opts = [...(newQuestion.options || [])];
                            opts[idx] = e.target.value;
                            setNewQuestion({...newQuestion, options: opts});
                          }} className="p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder={`Lựa chọn ${idx + 1}`} />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Đáp án đúng</label>
                    <input type="text" value={newQuestion.answer} onChange={(e) => setNewQuestion({...newQuestion, answer: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Đáp án..." />
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setIsAddQModalOpen(false)} className="px-6 py-2 text-gray-500 font-bold">Hủy</button>
                <button type="submit" form="add-q-form" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl">Lưu</button>
              </div>
            </motion.div>
          </div>
        )}

        {isAddKModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Thêm tài liệu mới</h2>
                <button onClick={() => setIsAddKModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <form id="add-k-form" onSubmit={handleAddResource} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Khối lớp</label>
                      <select value={newResource.grade} onChange={(e) => setNewResource({...newResource, grade: Number(e.target.value) as any})} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500">
                        <option value={6}>Lớp 6</option><option value={7}>Lớp 7</option><option value={8}>Lớp 8</option><option value={9}>Lớp 9</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase">Loại</label>
                      <select value={newResource.type} onChange={(e) => setNewResource({...newResource, type: e.target.value as any})} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="link">Liên kết</option><option value="video">Video</option><option value="app">Ứng dụng</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Tiêu đề</label>
                    <input type="text" value={newResource.title} onChange={(e) => setNewResource({...newResource, title: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" placeholder="Tên tài liệu..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">URL</label>
                    <input type="url" value={newResource.url} onChange={(e) => setNewResource({...newResource, url: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" placeholder="https://..." />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Mô tả</label>
                    <textarea value={newResource.description} onChange={(e) => setNewResource({...newResource, description: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]" placeholder="Mô tả ngắn..." />
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setIsAddKModalOpen(false)} className="px-6 py-2 text-gray-500 font-bold">Hủy</button>
                <button type="submit" form="add-k-form" className="px-6 py-2 bg-purple-600 text-white font-bold rounded-xl">Lưu</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
