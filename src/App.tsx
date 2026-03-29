import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import KnowledgeBase from './pages/KnowledgeBase';
import Students from './pages/Students';
import Assignments from './pages/Assignments';
import Game from './pages/Game';
import QuestionBank from './pages/QuestionBank';
import StudentLogin from './pages/StudentLogin';
import ParentView from './pages/ParentView';
import SourceData from './pages/SourceData';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="knowledge" element={<KnowledgeBase />} />
              <Route path="students" element={<Students />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="game" element={<Game />} />
              <Route path="bank" element={<QuestionBank />} />
              <Route path="student-login" element={<StudentLogin />} />
              <Route path="parent-view" element={<ParentView />} />
              <Route path="source-data" element={<SourceData />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
