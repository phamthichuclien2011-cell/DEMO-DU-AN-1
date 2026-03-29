export function calculateScore(correctCount: number, totalCount: number): number {
  return Math.round((correctCount / totalCount) * 100);
}

export function getGradeFeedback(score: number): string {
  if (score >= 90) return 'Xuất sắc! Bạn là một thiên tài!';
  if (score >= 70) return 'Rất tốt! Hãy tiếp tục phát huy nhé.';
  if (score >= 50) return 'Khá tốt. Bạn có thể làm tốt hơn nữa.';
  return 'Cố gắng lên! Luyện tập thêm sẽ giúp bạn tiến bộ.';
}

export function mockAIGrade(answer: string, correctAnswer: string): { score: number; feedback: string } {
  // Simple mock AI logic
  const similarity = answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim() ? 100 : 0;
  
  if (similarity === 100) {
    return { score: 100, feedback: 'Câu trả lời hoàn toàn chính xác. Bạn đã nắm vững kiến thức này!' };
  } else {
    // Check for partial match (mocked)
    const words = answer.toLowerCase().split(' ');
    const correctWords = correctAnswer.toLowerCase().split(' ');
    const matches = words.filter(w => correctWords.includes(w)).length;
    const ratio = matches / correctWords.length;

    if (ratio > 0.5) {
      return { score: 60, feedback: 'Bạn đã đi đúng hướng nhưng cần chi tiết và chính xác hơn.' };
    } else {
      return { score: 20, feedback: 'Câu trả lời chưa chính xác. Hãy xem lại phần giải thích để hiểu rõ hơn nhé.' };
    }
  }
}
