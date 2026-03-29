import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Trophy, Gamepad2, Play, RefreshCcw, Star, Zap, Swords, Puzzle, BookOpen, ArrowLeft, CheckCircle2, XCircle, Database } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question } from '../data/mockData';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { mockAIGrade } from '../utils/scoring';

type GameMode = 'hub' | 'numbers' | 'mcq' | 'fitb' | 'short-answer';

export default function Game() {
  const [currentMode, setCurrentMode] = useState<GameMode>('hub');
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'ended'>('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  // Numbers Game State
  const [targetNum, setTargetNum] = useState(0);

  // Literature Games State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'questions'), (snapshot) => {
      const qList: Question[] = [];
      snapshot.forEach((doc) => qList.push({ id: doc.id, ...doc.data() } as Question));
      setAllQuestions(qList);
    });

    return () => unsubscribe();
  }, []);

  // Filter questions based on mode
  const mcqQuestions = useMemo(() => allQuestions.filter(q => q.type === 'multiple-choice'), [allQuestions]);
  const fitbQuestions = useMemo(() => allQuestions.filter(q => q.type === 'fill-in-the-blank'), [allQuestions]);
  const shortAnswerQuestions = useMemo(() => allQuestions.filter(q => q.type === 'short-answer'), [allQuestions]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0 && !showFeedback) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      if (currentMode === 'numbers') {
        endGame();
      } else {
        handleWrongAnswer();
      }
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, currentMode, showFeedback]);

  const startGame = (mode: GameMode) => {
    setCurrentMode(mode);
    setScore(0);
    setLevel(1);
    setStreak(0);
    setGameState('playing');
    setShowFeedback(null);

    if (mode === 'numbers') {
      setTimeLeft(15);
      generateTarget();
    } else if (mode === 'mcq') {
      const shuffled = [...mcqQuestions].sort(() => 0.5 - Math.random());
      setQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setTimeLeft(15);
    } else if (mode === 'fitb') {
      const shuffled = [...fitbQuestions].sort(() => 0.5 - Math.random());
      setQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setTimeLeft(20);
      setUserAnswer('');
    } else if (mode === 'short-answer') {
      const shuffled = [...shortAnswerQuestions].sort(() => 0.5 - Math.random());
      setQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setTimeLeft(30);
      setUserAnswer('');
    }
  };

  const endGame = () => {
    setGameState('ended');
    if (score > 50) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  };

  const backToHub = () => {
    setCurrentMode('hub');
    setGameState('idle');
  };

  // --- Numbers Game Logic ---
  const generateTarget = () => {
    setTargetNum(Math.floor(Math.random() * 9) + 1);
  };

  const handleNumClick = (num: number) => {
    if (gameState !== 'playing') return;
    if (num === targetNum) {
      setScore(prev => prev + 10);
      generateTarget();
    } else {
      setTimeLeft(prev => Math.max(0, prev - 2)); // Penalty
    }
  };

  // --- Literature Games Logic ---
  const handleAnswer = (answer: string) => {
    if (gameState !== 'playing' || showFeedback) return;
    
    const currentQ = questions[currentQuestionIndex];
    let isCorrect = false;
    let pointsEarned = 0;

    if (currentMode === 'short-answer') {
      const grade = mockAIGrade(answer, currentQ.answer);
      if (grade.score >= 50) {
        isCorrect = true;
        pointsEarned = Math.floor((grade.score / 100) * (15 * level + Math.floor(timeLeft / 2)));
      }
    } else {
      isCorrect = answer.toLowerCase().trim() === currentQ.answer.toLowerCase().trim();
      if (isCorrect) {
        pointsEarned = 10 * level + Math.floor(timeLeft / 2);
      }
    }

    if (isCorrect) {
      setShowFeedback('correct');
      setScore(prev => prev + pointsEarned);
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Level up every 3 correct answers
      if (newStreak % 3 === 0) {
        setLevel(prev => prev + 1);
      }
    } else {
      handleWrongAnswer();
    }

    setTimeout(() => {
      if (isCorrect) {
        nextQuestion();
      }
    }, 1500);
  };

  const handleWrongAnswer = () => {
    setShowFeedback('incorrect');
    setStreak(0);
    setTimeout(() => {
      endGame();
    }, 2000);
  };

  const nextQuestion = () => {
    setShowFeedback(null);
    setUserAnswer('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      // Decrease time based on level to increase difficulty
      const baseTime = currentMode === 'short-answer' ? 30 : (currentMode === 'fitb' ? 20 : 15);
      setTimeLeft(Math.max(5, baseTime - (level - 1) * 2)); 
    } else {
      endGame(); // Won the game
    }
  };

  // --- Render Helpers ---
  const renderHub = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          <Gamepad2 className="w-4 h-4" />
          Khu Vực Giải Trí & Học Tập
        </div>
        <h1 className="text-4xl font-black text-gray-800">Trò Chơi Ngữ Văn 🎮</h1>
        <p className="text-gray-500">Vừa học vừa chơi, nâng cao kiến thức văn học qua các thử thách hấp dẫn!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Game 1 */}
        <motion.div 
          whileHover={{ y: -5 }}
          onClick={() => startGame('mcq')}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-red-200">
            <Swords className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Đấu Trường Văn Học</h3>
          <p className="text-gray-500 mb-4">Thử thách trắc nghiệm kiến thức Ngữ Văn. Trả lời càng nhanh, điểm càng cao. Độ khó tăng dần!</p>
          <div className="flex items-center gap-2 text-sm font-bold text-red-500">
            <Play className="w-4 h-4" /> Chơi ngay
          </div>
        </motion.div>

        {/* Game 2 */}
        <motion.div 
          whileHover={{ y: -5 }}
          onClick={() => startGame('fitb')}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-200">
            <Puzzle className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Mảnh Ghép Thi Nhân</h3>
          <p className="text-gray-500 mb-4">Thử tài trí nhớ với các câu thơ, nhận định văn học kinh điển. Điền khuyết để hoàn thành mảnh ghép!</p>
          <div className="flex items-center gap-2 text-sm font-bold text-blue-500">
            <Play className="w-4 h-4" /> Chơi ngay
          </div>
        </motion.div>

        {/* Game 3 */}
        <motion.div 
          whileHover={{ y: -5 }}
          onClick={() => startGame('short-answer')}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-200">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Vượt Ải Ngôn Từ</h3>
          <p className="text-gray-500 mb-4">Trả lời ngắn gọn các câu hỏi về tác giả, tác phẩm. AI sẽ chấm điểm câu trả lời của bạn!</p>
          <div className="flex items-center gap-2 text-sm font-bold text-purple-500">
            <Play className="w-4 h-4" /> Chơi ngay
          </div>
        </motion.div>

        {/* Game 4 */}
        <motion.div 
          whileHover={{ y: -5 }}
          onClick={() => startGame('numbers')}
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-green-200">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Thử Thách Phản Xạ</h3>
          <p className="text-gray-500 mb-4">Mini game giải trí giúp rèn luyện sự tập trung và phản xạ nhanh nhạy.</p>
          <div className="flex items-center gap-2 text-sm font-bold text-green-500">
            <Play className="w-4 h-4" /> Chơi ngay
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderHeader = (title: string, colorClass: string) => (
    <div className="flex justify-between items-center w-full mb-8">
      <button onClick={backToHub} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <div className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest ${colorClass}`}>
        {title} - Level {level}
      </div>
      <div className="w-10" /> {/* Spacer for centering */}
    </div>
  );

  const renderStats = () => (
    <div className="flex justify-between items-center w-full px-4 md:px-12 mb-8">
      <div className="flex items-center gap-3 bg-gray-50 px-4 md:px-6 py-3 rounded-2xl border border-gray-100">
        <Timer className={`w-5 h-5 md:w-6 md:h-6 ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
        <span className={`text-xl md:text-2xl font-black ${timeLeft < 5 ? 'text-red-600' : 'text-gray-700'}`}>{timeLeft}s</span>
      </div>
      <div className="flex items-center gap-2 md:gap-3 bg-orange-50 px-4 md:px-6 py-3 rounded-2xl border border-orange-100">
        <Star className="w-5 h-5 md:w-6 md:h-6 text-orange-500 fill-orange-500" />
        <span className="text-xl md:text-2xl font-black text-orange-600">{score}</span>
      </div>
      <div className="hidden md:flex items-center gap-2 bg-purple-50 px-6 py-3 rounded-2xl border border-purple-100">
        <Zap className="w-6 h-6 text-purple-500 fill-purple-500" />
        <span className="text-2xl font-black text-purple-600">Chuỗi: {streak}</span>
      </div>
    </div>
  );

  const renderFeedbackOverlay = () => (
    <AnimatePresence>
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center rounded-[3rem] backdrop-blur-sm ${
            showFeedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}
        >
          <motion.div 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className={`p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4 ${
              showFeedback === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {showFeedback === 'correct' ? (
              <>
                <CheckCircle2 className="w-20 h-20" />
                <h2 className="text-3xl font-black">Chính xác!</h2>
                <p className="text-green-100 font-medium">+{10 * level + Math.floor(timeLeft / 2)} điểm</p>
              </>
            ) : (
              <>
                <XCircle className="w-20 h-20" />
                <h2 className="text-3xl font-black">Sai rồi!</h2>
                <p className="text-red-100 font-medium">Trò chơi kết thúc</p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {currentMode === 'hub' ? (
        renderHub()
      ) : (
        <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-2xl border border-gray-100 relative overflow-hidden min-h-[600px] flex flex-col items-center">
          {gameState === 'playing' && currentMode === 'numbers' && (
            <motion.div key="playing-numbers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center">
              {renderHeader('Thử Thách Phản Xạ', 'bg-green-100 text-green-600')}
              {renderStats()}
              <div className="flex flex-col items-center gap-12 mt-8">
                <motion.div
                  key={targetNum}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200"
                >
                  <span className="text-6xl md:text-7xl font-black text-white">{targetNum}</span>
                </motion.div>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      onClick={() => handleNumClick(num)}
                      className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 hover:bg-white hover:shadow-xl hover:border-emerald-400 border-2 border-transparent rounded-2xl text-2xl font-black text-gray-400 hover:text-emerald-600 transition-all active:scale-90"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && currentMode !== 'numbers' && questions.length === 0 && (
            <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4 my-auto">
              <Database className="w-16 h-16 text-gray-300" />
              <h3 className="text-2xl font-bold text-gray-800">Chưa có câu hỏi</h3>
              <p className="text-gray-500">Giáo viên cần thêm câu hỏi cho thể loại này vào Ngân hàng câu hỏi.</p>
              <button 
                onClick={backToHub}
                className="mt-4 px-6 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Quay lại
              </button>
            </div>
          )}

          {gameState === 'playing' && currentMode === 'mcq' && questions.length > 0 && (
            <motion.div key="playing-mcq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full flex flex-col relative">
              {renderFeedbackOverlay()}
              {renderHeader('Đấu Trường Văn Học', 'bg-red-100 text-red-600')}
              {renderStats()}
              
              <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full space-y-8">
                <div className="bg-gray-50 p-6 md:p-8 rounded-3xl border border-gray-100 relative">
                  <div className="absolute -top-4 left-8 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Câu {currentQuestionIndex + 1} / {questions.length}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed text-center mt-2">
                    {questions[currentQuestionIndex].question}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentQuestionIndex].options?.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(opt)}
                      className="p-4 md:p-6 bg-white border-2 border-gray-100 rounded-2xl text-left hover:border-red-400 hover:bg-red-50 hover:shadow-md transition-all group flex items-center gap-4"
                    >
                      <span className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-100 group-hover:text-red-600 flex items-center justify-center font-bold text-gray-500 transition-colors shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-medium text-gray-700 group-hover:text-red-700">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && (currentMode === 'fitb' || currentMode === 'short-answer') && questions.length > 0 && (
            <motion.div key="playing-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full flex flex-col relative">
              {renderFeedbackOverlay()}
              {renderHeader(currentMode === 'fitb' ? 'Mảnh Ghép Thi Nhân' : 'Vượt Ải Ngôn Từ', currentMode === 'fitb' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600')}
              {renderStats()}
              
              <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full space-y-8">
                <div className={`${currentMode === 'fitb' ? 'bg-blue-50/50 border-blue-100' : 'bg-purple-50/50 border-purple-100'} p-6 md:p-10 rounded-3xl border relative text-center`}>
                  <div className={`absolute -top-4 left-8 ${currentMode === 'fitb' ? 'bg-blue-500' : 'bg-purple-500'} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
                    Câu {currentQuestionIndex + 1} / {questions.length}
                  </div>
                  {currentMode === 'fitb' ? (
                    <Puzzle className="w-12 h-12 text-blue-200 mx-auto mb-4" />
                  ) : (
                    <BookOpen className="w-12 h-12 text-purple-200 mx-auto mb-4" />
                  )}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
                    {currentMode === 'fitb' ? (
                      questions[currentQuestionIndex].question.split('___').map((part, i, arr) => (
                        <span key={i}>
                          {part}
                          {i < arr.length - 1 && (
                            <span className="inline-block w-24 border-b-2 border-blue-400 mx-2" />
                          )}
                        </span>
                      ))
                    ) : (
                      questions[currentQuestionIndex].question
                    )}
                  </h3>
                </div>

                <form 
                  onSubmit={(e) => { e.preventDefault(); handleAnswer(userAnswer); }}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={currentMode === 'fitb' ? "Nhập từ còn thiếu..." : "Nhập câu trả lời của bạn..."}
                    className={`w-full p-5 text-center text-xl font-bold bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-${currentMode === 'fitb' ? 'blue' : 'purple'}-500 focus:ring-4 focus:ring-${currentMode === 'fitb' ? 'blue' : 'purple'}-500/20 outline-none transition-all`}
                    autoFocus
                  />
                  <button 
                    type="submit"
                    disabled={!userAnswer.trim()}
                    className={`w-full py-4 ${currentMode === 'fitb' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'} text-white font-bold text-lg rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg`}
                  >
                    Trả lời
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {gameState === 'ended' && (
            <motion.div
              key="ended"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-8 my-auto"
            >
              <div className="relative inline-block">
                <Trophy className="w-32 h-32 text-yellow-500 mx-auto" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 border-4 border-dashed border-yellow-200 rounded-full -m-4"
                />
              </div>
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-gray-800">Trò chơi kết thúc!</h2>
                <p className="text-gray-500 text-lg">Bạn đã đạt được</p>
                <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                  {score} <span className="text-3xl">điểm</span>
                </p>
                <p className="text-gray-500 font-medium mt-4">Cấp độ đạt được: <span className="text-purple-600 font-bold">Level {level}</span></p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button 
                  onClick={() => startGame(currentMode)}
                  className="flex justify-center items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-2xl hover:shadow-lg hover:scale-105 transition-all"
                >
                  <RefreshCcw className="w-5 h-5" />
                  Chơi lại
                </button>
                <button 
                  onClick={backToHub}
                  className="flex justify-center items-center gap-2 px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Về sảnh chính
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
