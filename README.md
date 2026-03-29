# EduQuest - Nền tảng Giáo dục Tương tác

EduQuest là một ứng dụng web giáo dục hiện đại, được thiết kế với phong cách vui nhộn, sinh động (tương tự Kahoot, Duolingo, ClassDojo) nhằm mang lại trải nghiệm học tập tốt nhất cho học sinh.

## ✨ Tính năng chính

- **Dashboard**: Tổng quan bài học, thống kê và bảng xếp hạng.
- **Quiz Engine**: Hỗ trợ trắc nghiệm, điền khuyết và trả lời ngắn với chấm điểm AI (giả lập).
- **Game Tương tác**: Trò chơi phản xạ nhanh với timer và leaderboard.
- **Quản lý học sinh**: Theo dõi điểm số, thứ hạng và huy hiệu.
- **Quản lý bài tập**: Giao bài và theo dõi trạng thái hoàn thành.
- **Ngân hàng câu hỏi**: CRUD câu hỏi theo môn học.
- **AI Chatbot**: Trợ lý học tập hỗ trợ giải đáp thắc mắc.

## ⚙️ Công nghệ sử dụng

- **Frontend**: React 19, Vite, TypeScript.
- **Styling**: Tailwind CSS v4.
- **Animation**: Framer Motion.
- **Routing**: React Router v7.
- **Icons**: Lucide React.
- **Effects**: Canvas Confetti.

## 🚀 Hướng dẫn triển khai (Deployment)

### 1. Cài đặt môi trường
Đảm bảo bạn đã cài đặt Node.js (phiên bản 18 trở lên).

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Chạy môi trường phát triển (Development)
```bash
npm run dev
```

### 4. Xây dựng bản Production (Build)
```bash
npm run build
```
Sau khi chạy lệnh này, thư mục `dist/` sẽ được tạo ra chứa toàn bộ mã nguồn đã được tối ưu hóa.

### 5. Deploy lên Netlify / Vercel
- **Netlify**: Kéo thả thư mục `dist/` vào trang deploy của Netlify hoặc kết nối với kho lưu trữ GitHub.
- **Vercel**: Sử dụng lệnh `vercel` hoặc kết nối GitHub, Vercel sẽ tự động nhận diện project Vite và build.

---
*Phát triển bởi Senior Frontend Engineer & Product Designer.*
