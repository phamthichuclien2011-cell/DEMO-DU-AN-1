export interface Question {
  id: string;
  type: 'multiple-choice' | 'fill-in-the-blank' | 'short-answer' | 'paragraph' | 'essay';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  category: string;
}

export interface Student {
  id: string;
  name: string;
  school?: string;
  score: number;
  rank: number;
  badges: string[];
  assignments: {
    id: string;
    title: string;
    status: 'completed' | 'pending';
  }[];
}

export interface Lesson {
  id: string;
  title: string;
  thumbnail: string;
  youtubeId?: string;
  driveLink?: string;
  category: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'link' | 'app';
  url: string;
  thumbnail?: string;
  description: string;
  grade: 6 | 7 | 8 | 9;
}

export const mockResources: Resource[] = [
  {
    id: 'r1',
    title: 'Sơ đồ tư duy Truyện Kiều',
    type: 'app',
    url: 'https://coggle.it/diagram/example',
    thumbnail: 'https://picsum.photos/seed/kieu/400/250',
    description: 'Ứng dụng vẽ sơ đồ tư duy tóm tắt các nhân vật và sự kiện chính trong Truyện Kiều.',
    grade: 9
  },
  {
    id: 'r2',
    title: 'Phân tích bài thơ Đồng chí',
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/dongchi/400/250',
    description: 'Video bài giảng chi tiết về bài thơ Đồng chí của Chính Hữu.',
    grade: 9
  },
  {
    id: 'r3',
    title: 'Tài liệu đọc hiểu Lão Hạc',
    type: 'link',
    url: 'https://vi.wikipedia.org/wiki/L%C3%A3o_H%E1%BA%A1c',
    description: 'Bài viết phân tích sâu sắc về nhân vật Lão Hạc và bối cảnh xã hội.',
    grade: 8
  },
  {
    id: 'r4',
    title: 'Game ô chữ Văn học dân gian',
    type: 'app',
    url: 'https://wordwall.net/play/example',
    thumbnail: 'https://picsum.photos/seed/dangan/400/250',
    description: 'Trò chơi ô chữ ôn tập kiến thức về ca dao, tục ngữ, truyện cổ tích.',
    grade: 6
  },
  {
    id: 'r5',
    title: 'Phân tích Tinh thần yêu nước của nhân dân ta',
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://picsum.photos/seed/yeunuoc/400/250',
    description: 'Video bài giảng về văn bản nghị luận của Chủ tịch Hồ Chí Minh.',
    grade: 7
  }
];

export const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'multiple-choice',
    question: 'Tác phẩm "Chuyện người con gái Nam Xương" của Nguyễn Dữ được trích từ tập sách nào?',
    options: ['Truyền kỳ mạn lục', 'Thượng kinh ký sự', 'Vũ trung tùy bút', 'Lĩnh Nam chích quái'],
    answer: 'Truyền kỳ mạn lục',
    explanation: '"Chuyện người con gái Nam Xương" là truyện thứ 16 trong 20 truyện của tập "Truyền kỳ mạn lục".',
    category: 'Văn học trung đại (Lớp 9)'
  },
  {
    id: '2',
    type: 'fill-in-the-blank',
    question: 'Trong bài thơ "Đồng chí", Chính Hữu viết: "Đêm nay rừng hoang sương muối / Đứng cạnh bên nhau chờ ___"',
    answer: 'giặc tới',
    explanation: 'Câu thơ kết thúc bằng hình ảnh "Đứng cạnh bên nhau chờ giặc tới / Đầu súng trăng treo".',
    category: 'Thơ hiện đại (Lớp 9)'
  },
  {
    id: '3',
    type: 'short-answer',
    question: 'Nhân vật lão Hạc trong truyện ngắn cùng tên của Nam Cao chọn cái chết bằng cách nào?',
    answer: 'Ăn bả chó',
    explanation: 'Lão Hạc đã chọn cái chết bằng bả chó để bảo toàn tài sản cho con trai và không muốn làm phiền hàng xóm.',
    category: 'Văn học hiện thực (Lớp 8)'
  },
  {
    id: '4',
    type: 'multiple-choice',
    question: 'Bài thơ "Ông đồ" của Vũ Đình Liên thể hiện niềm cảm thương chân thành cho đối tượng nào?',
    options: ['Những người nghèo khổ', 'Lớp người trí thức cũ đang tàn tạ', 'Những người nông dân', 'Những người lính'],
    answer: 'Lớp người trí thức cũ đang tàn tạ',
    explanation: 'Bài thơ thể hiện nỗi lòng thương tiếc những giá trị văn hóa truyền thống đang dần bị lãng quên.',
    category: 'Thơ mới (Lớp 8)'
  },
  {
    id: '5',
    type: 'fill-in-the-blank',
    question: 'Tác giả của bài thơ "Quê hương" với câu thơ "Cánh buồm giương to như mảnh hồn làng" là ___',
    answer: 'Tế Hanh',
    explanation: 'Tế Hanh là nhà thơ của quê hương miền biển, bài thơ "Quê hương" là tác phẩm tiêu biểu của ông.',
    category: 'Thơ hiện đại (Lớp 8)'
  },
  {
    id: '6',
    type: 'multiple-choice',
    question: 'Trong văn bản "Chiếu dời đô", Lý Công Uẩn chọn vùng đất nào làm kinh đô mới?',
    options: ['Hoa Lư', 'Đại La', 'Phú Xuân', 'Cổ Loa'],
    answer: 'Đại La',
    explanation: 'Lý Công Uẩn đã quyết định dời đô từ Hoa Lư về thành Đại La (sau đổi tên thành Thăng Long).',
    category: 'Văn học trung đại (Lớp 8)'
  },
  {
    id: '7',
    type: 'short-answer',
    question: 'Ai là tác giả của văn bản "Hịch tướng sĩ"?',
    answer: 'Trần Quốc Tuấn',
    explanation: 'Hưng Đạo Vương Trần Quốc Tuấn viết "Hịch tướng sĩ" để khích lệ tinh thần quân sĩ trước cuộc kháng chiến chống quân Nguyên - Mông.',
    category: 'Văn học trung đại (Lớp 8)'
  },
  {
    id: '8',
    type: 'multiple-choice',
    question: 'Nhân vật chính trong truyện ngắn "Làng" của Kim Lân là ai?',
    options: ['Ông Hai', 'Ông Ba', 'Anh Thanh', 'Cụ Mết'],
    answer: 'Ông Hai',
    explanation: 'Ông Hai là nhân vật trung tâm thể hiện tình yêu làng hòa quyện với lòng yêu nước trong kháng chiến.',
    category: 'Văn học hiện đại (Lớp 9)'
  },
  {
    id: '9',
    type: 'fill-in-the-blank',
    question: 'Truyện ngắn "Lặng lẽ Sa Pa" là kết quả của chuyến đi thực tế của nhà văn ___',
    answer: 'Nguyễn Thành Long',
    explanation: 'Nguyễn Thành Long viết tác phẩm này sau chuyến đi thực tế ở Lào Cai năm 1970.',
    category: 'Văn học hiện đại (Lớp 9)'
  },
  {
    id: '10',
    type: 'multiple-choice',
    question: 'Chi tiết "chiếc bóng" trong "Chuyện người con gái Nam Xương" đóng vai trò gì?',
    options: ['Làm đẹp cho tác phẩm', 'Thắt nút và mở nút câu chuyện', 'Thể hiện tình mẫu tử', 'Miêu tả tâm lý nhân vật'],
    answer: 'Thắt nút và mở nút câu chuyện',
    explanation: 'Chiếc bóng là chi tiết nghệ thuật đặc sắc gây nên nỗi oan khuất và cũng là chìa khóa giải tỏa nỗi oan của Vũ Nương.',
    category: 'Văn học trung đại (Lớp 9)'
  },
  {
    id: '11',
    type: 'short-answer',
    question: 'Nêu tên tác giả bài thơ "Bếp lửa".',
    answer: 'Bằng Việt',
    explanation: 'Bài thơ "Bếp lửa" được Bằng Việt sáng tác năm 1963 khi đang là sinh viên học luật tại Liên Xô.',
    category: 'Thơ hiện đại (Lớp 9)'
  },
  {
    id: '12',
    type: 'multiple-choice',
    question: 'Hình ảnh "trăng" trong bài thơ "Ánh trăng" của Nguyễn Duy tượng trưng cho điều gì?',
    options: ['Vẻ đẹp thiên nhiên', 'Quá khứ nghĩa tình', 'Tương lai tươi sáng', 'Ánh sáng tri thức'],
    answer: 'Quá khứ nghĩa tình',
    explanation: 'Vầng trăng là biểu tượng của quá khứ vẹn nguyên, nghĩa tình mà con người không được phép lãng quên.',
    category: 'Thơ hiện đại (Lớp 9)'
  },
  {
    id: '13',
    type: 'fill-in-the-blank',
    question: 'Trong bài thơ "Viếng lăng Bác", Viễn Phương muốn làm "Con chim hót quanh lăng Bác", "Đóa hoa tỏa hương" và "___"',
    answer: 'Cây tre trung hiếu',
    explanation: 'Ước nguyện chân thành của tác giả là được ở mãi bên Bác thông qua hình ảnh cây tre trung hiếu.',
    category: 'Thơ hiện đại (Lớp 9)'
  },
  {
    id: '14',
    type: 'multiple-choice',
    question: 'Tác phẩm "Chiếc lược ngà" của Nguyễn Quang Sáng viết về đề tài nào?',
    options: ['Tình yêu đôi lứa', 'Tình đồng chí', 'Tình phụ tử trong chiến tranh', 'Tình cảm gia đình thời bình'],
    answer: 'Tình phụ tử trong chiến tranh',
    explanation: 'Truyện ca ngợi tình cha con sâu nặng và cảm động trong hoàn cảnh éo le của chiến tranh.',
    category: 'Văn học hiện đại (Lớp 9)'
  },
  {
    id: '15',
    type: 'short-answer',
    question: 'Tác giả của bài thơ "Mùa xuân nho nhỏ" là ai?',
    answer: 'Thanh Hải',
    explanation: 'Thanh Hải viết bài thơ này vào tháng 11/1980, không lâu trước khi ông qua đời, thể hiện tình yêu cuộc sống thiết tha.',
    category: 'Thơ hiện đại (Lớp 9)'
  },
  {
    id: '16',
    type: 'multiple-choice',
    question: 'Đoạn trích "Chị em Thúy Kiều" nằm ở phần nào của "Truyện Kiều"?',
    options: ['Gặp gỡ và đính ước', 'Gia biến và lưu lạc', 'Đoàn tụ', 'Kết thúc'],
    answer: 'Gặp gỡ và đính ước',
    explanation: 'Đoạn trích nằm ở phần đầu tác phẩm, giới thiệu gia cảnh và nhan sắc, tài năng của hai chị em Kiều.',
    category: 'Văn học trung đại (Lớp 9)'
  },
  {
    id: '17',
    type: 'fill-in-the-blank',
    question: 'Trong văn bản "Nước Đại Việt ta", Nguyễn Trãi khẳng định: "Như nước Đại Việt ta từ trước / Vốn xưng nền ___ đã lâu"',
    answer: 'văn hiến',
    explanation: 'Đây là lời khẳng định về chủ quyền và nền văn hiến lâu đời của dân tộc Việt Nam.',
    category: 'Văn học trung đại (Lớp 8)'
  },
  {
    id: '18',
    type: 'short-answer',
    question: 'Nhân vật chị Dậu trong đoạn trích "Tức nước vỡ bờ" là của tác giả nào?',
    answer: 'Ngô Tất Tố',
    explanation: 'Đoạn trích "Tức nước vỡ bờ" nằm trong chương XVIII của tiểu thuyết "Tắt đèn" nổi tiếng của Ngô Tất Tố.',
    category: 'Văn học hiện thực (Lớp 8)'
  },
  {
    id: '19',
    type: 'multiple-choice',
    question: 'Bài thơ "Sang thu" của Hữu Thỉnh miêu tả thời điểm nào?',
    options: ['Đầu mùa hạ', 'Cuối mùa hạ đầu mùa thu', 'Giữa mùa thu', 'Cuối mùa thu đầu mùa đông'],
    answer: 'Cuối mùa hạ đầu mùa thu',
    explanation: 'Bài thơ ghi lại những biến chuyển tinh tế của thiên nhiên lúc giao mùa từ hạ sang thu.',
    category: 'Thơ hiện đại (Lớp 9)'
  },
  {
    id: '20',
    type: 'fill-in-the-blank',
    question: 'Tác giả của bài thơ "Nói với con" là nhà thơ ___',
    answer: 'Y Phương',
    explanation: 'Y Phương là nhà thơ dân tộc Tày, bài thơ thể hiện tình cảm gia đình và niềm tự hào về truyền thống quê hương.',
    category: 'Thơ hiện đại (Lớp 9)'
  },
  {
    id: '21',
    type: 'multiple-choice',
    question: 'Ba nữ thanh niên xung phong trong "Những ngôi sao xa xôi" là ai?',
    options: ['Phương Định, Nho, Thao', 'Phương Định, Lan, Huệ', 'Nho, Thao, Cúc', 'Thao, Nho, Hồng'],
    answer: 'Phương Định, Nho, Thao',
    explanation: 'Ba cô gái trẻ sống và chiến đấu tại một trọng điểm trên tuyến đường Trường Sơn khốc liệt.',
    category: 'Văn học hiện đại (Lớp 9)'
  },
  {
    id: '22',
    type: 'short-answer',
    question: 'Ai là tác giả của bài thơ "Khi con tu hú"?',
    answer: 'Tố Hữu',
    explanation: 'Tố Hữu viết bài thơ này khi đang bị giam cầm trong nhà lao Thừa Phủ (Huế) vào tháng 7/1939.',
    category: 'Thơ cách mạng (Lớp 8)'
  },
  {
    id: '23',
    type: 'multiple-choice',
    question: 'Văn bản "Trong lòng mẹ" trích từ tập hồi ký nào của Nguyên Hồng?',
    options: ['Những ngày thơ ấu', 'Bỉ vỏ', 'Cửa biển', 'Trời xanh'],
    answer: 'Những ngày thơ ấu',
    explanation: '"Những ngày thơ ấu" là tập hồi ký cảm động về tuổi thơ cay đắng nhưng giàu tình thương của tác giả.',
    category: 'Văn học hiện đại (Lớp 8)'
  },
  {
    id: '24',
    type: 'fill-in-the-blank',
    question: 'Trong bài thơ "Đoàn thuyền đánh cá", câu thơ "Hát rằng: hát rằng cá bạc biển Đông lặng" thể hiện tinh thần ___ của ngư dân.',
    answer: 'lạc quan',
    explanation: 'Tiếng hát thể hiện niềm vui lao động và tinh thần lạc quan, yêu đời của những người làm chủ biển trời.',
    category: 'Thơ hiện đại (Lớp 9)'
  },
  {
    id: '25',
    type: 'short-answer',
    question: 'Tác giả của bài thơ "Bài thơ về tiểu đội xe không kính" là ai?',
    answer: 'Phạm Tiến Duật',
    explanation: 'Phạm Tiến Duật là gương mặt tiêu biểu của thế hệ nhà thơ trẻ thời kỳ kháng chiến chống Mỹ.',
    category: 'Thơ hiện đại (Lớp 9)'
  }
];

export const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'Nguyễn Văn A',
    school: 'THCS Chu Văn An',
    score: 950,
    rank: 1,
    badges: ['Học giả', 'Chăm chỉ'],
    assignments: [
      { id: 'a1', title: 'Phân tích bài thơ Sóng', status: 'completed' },
      { id: 'a2', title: 'Cảm nhận về Lão Hạc', status: 'pending' }
    ]
  },
  {
    id: 's2',
    name: 'Trần Thị B',
    school: 'THCS Phan Chu Trinh',
    score: 880,
    rank: 2,
    badges: ['Sáng tạo'],
    assignments: [
      { id: 'a1', title: 'Phân tích bài thơ Sóng', status: 'completed' },
      { id: 'a2', title: 'Cảm nhận về Lão Hạc', status: 'completed' }
    ]
  },
  {
    id: 's3',
    name: 'Lê Văn C',
    school: 'THCS Trưng Vương',
    score: 720,
    rank: 3,
    badges: ['Nỗ lực'],
    assignments: [
      { id: 'a1', title: 'Phân tích bài thơ Sóng', status: 'pending' },
      { id: 'a2', title: 'Cảm nhận về Lão Hạc', status: 'pending' }
    ]
  }
];

export const mockLessons: Lesson[] = [
  {
    id: 'l1',
    title: 'Phân tích bài thơ Tây Tiến',
    thumbnail: 'https://picsum.photos/seed/literature1/400/250',
    youtubeId: 'pS-W_G9_N0-A',
    category: 'Thơ hiện đại'
  },
  {
    id: 'l2',
    title: 'Nghệ thuật xây dựng nhân vật trong Tắt đèn',
    thumbnail: 'https://picsum.photos/seed/literature2/400/250',
    driveLink: 'https://docs.google.com/presentation/d/e/2PACX-1vT_...',
    category: 'Văn học hiện thực'
  },
  {
    id: 'l3',
    title: 'Ôn tập kiến thức Văn học dân gian',
    thumbnail: 'https://picsum.photos/seed/literature3/400/250',
    youtubeId: 'mN5_p9_N0-A',
    category: 'Văn học dân gian'
  }
];
