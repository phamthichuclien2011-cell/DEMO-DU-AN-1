import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Video, Link as LinkIcon, LayoutGrid, Plus, X, ExternalLink, Play, Trash2 } from 'lucide-react';
import { Resource } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function KnowledgeBase() {
  const { userType } = useAuth();
  const [activeGrade, setActiveGrade] = useState<6 | 7 | 8 | 9>(6);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'resources'), (snapshot) => {
      const rList: Resource[] = [];
      snapshot.forEach((doc) => {
        rList.push({ id: doc.id, ...doc.data() } as Resource);
      });
      setResources(rList);
    });
    return () => unsubscribe();
  }, []);

  const [newResource, setNewResource] = useState<Partial<Resource>>({
    title: '',
    type: 'link',
    url: '',
    thumbnail: '',
    description: '',
    grade: 6
  });

  const filteredResources = resources.filter(r => r.grade === activeGrade);

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
      setIsAddModalOpen(false);
      setNewResource({ title: '', type: 'link', url: '', thumbnail: '', description: '', grade: activeGrade });
    } catch (error) {
      console.error("Error adding resource:", error);
    }
  };

  const deleteResource = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'resources', id));
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  const openResource = (resource: Resource) => {
    if (resource.type === 'link') {
      window.open(resource.url, '_blank');
    } else {
      setSelectedResource(resource);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-red-500" />;
      case 'app': return <LayoutGrid className="w-5 h-5 text-purple-500" />;
      default: return <LinkIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Video bài giảng';
      case 'app': return 'Ứng dụng / Trò chơi';
      default: return 'Tài liệu tham khảo';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-600" />
            Kho tri thức Ngữ văn
          </h1>
          <p className="text-gray-500">Tài liệu, video và ứng dụng hỗ trợ học tập theo từng khối lớp.</p>
        </div>
        {userType === 'teacher' && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-5 h-5" />
            Thêm tài liệu
          </button>
        )}
      </div>

      {/* Grade Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[6, 7, 8, 9].map((grade) => (
          <button
            key={grade}
            onClick={() => setActiveGrade(grade as 6 | 7 | 8 | 9)}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all whitespace-nowrap ${
              activeGrade === grade 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105' 
                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            Khối Lớp {grade}
          </button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredResources.map((resource, i) => (
            <motion.div
              layout
              key={resource.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group flex flex-col"
            >
              <div 
                className="relative h-48 bg-gray-100 cursor-pointer overflow-hidden"
                onClick={() => openResource(resource)}
              >
                {resource.thumbnail ? (
                  <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
                    {getIcon(resource.type)}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-gray-900 shadow-lg backdrop-blur-sm">
                    {resource.type === 'video' ? <Play className="w-5 h-5 ml-1" /> : <ExternalLink className="w-5 h-5" />}
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">
                  {getIcon(resource.type)}
                  <span className="text-gray-700">{getTypeLabel(resource.type)}</span>
                </div>
                {userType === 'teacher' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteResource(resource.id); }}
                    className="absolute top-4 right-4 p-2 bg-red-500/90 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors cursor-pointer" onClick={() => openResource(resource)}>
                  {resource.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4 flex-1">
                  {resource.description}
                </p>
                <button 
                  onClick={() => openResource(resource)}
                  className="w-full py-3 bg-gray-50 text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
                >
                  {resource.type === 'video' ? 'Xem video' : resource.type === 'app' ? 'Mở ứng dụng' : 'Truy cập liên kết'}
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
          {filteredResources.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Chưa có tài liệu nào cho khối lớp này.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Resource Modal */}
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
                <h2 className="text-2xl font-bold text-gray-800">Thêm tài liệu mới</h2>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <form id="add-resource-form" onSubmit={handleAddResource} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Khối lớp</label>
                      <select
                        value={newResource.grade}
                        onChange={(e) => setNewResource({ ...newResource, grade: Number(e.target.value) as 6 | 7 | 8 | 9 })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                        required
                      >
                        <option value={6}>Lớp 6</option>
                        <option value={7}>Lớp 7</option>
                        <option value={8}>Lớp 8</option>
                        <option value={9}>Lớp 9</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Loại tài liệu</label>
                      <select
                        value={newResource.type}
                        onChange={(e) => setNewResource({ ...newResource, type: e.target.value as Resource['type'] })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                        required
                      >
                        <option value="link">Liên kết / Bài viết</option>
                        <option value="video">Video bài giảng</option>
                        <option value="app">Ứng dụng / Trò chơi</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Tên tài liệu</label>
                    <input
                      type="text"
                      value={newResource.title}
                      onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="VD: Sơ đồ tư duy Truyện Kiều"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Đường dẫn (URL)</label>
                    <input
                      type="url"
                      value={newResource.url}
                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="https://..."
                      required
                    />
                    {newResource.type === 'video' && (
                      <p className="text-xs text-gray-500 mt-1">Lưu ý: Với YouTube, vui lòng sử dụng link nhúng (embed link), VD: https://www.youtube.com/embed/...</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Ảnh bìa (URL - Tùy chọn)</label>
                    <input
                      type="url"
                      value={newResource.thumbnail}
                      onChange={(e) => setNewResource({ ...newResource, thumbnail: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Mô tả ngắn</label>
                    <textarea
                      value={newResource.description}
                      onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none min-h-[100px]"
                      placeholder="Nhập mô tả về tài liệu..."
                      required
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
                  form="add-resource-form"
                  className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Lưu tài liệu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Resource Viewer Modal (Video/App) */}
      <AnimatePresence>
        {selectedResource && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-[85vh]"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-3">
                  {getIcon(selectedResource.type)}
                  <h2 className="text-xl font-bold text-gray-800 line-clamp-1">{selectedResource.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.open(selectedResource.url, '_blank')}
                    className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors tooltip"
                    title="Mở trong tab mới"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedResource(null)}
                    className="p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-gray-100 relative">
                <iframe 
                  src={selectedResource.url} 
                  className="absolute inset-0 w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
