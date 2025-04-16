import { useState, KeyboardEvent } from 'react';
import { BaseProps } from '@/types/jsx';

interface Question {
  type: 'multiple-choice' | 'translate' | 'listen';
  question: string;
  options?: string[];
  correctAnswer: string;
  audioUrl?: string;
}

interface LessonProps extends BaseProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

export default function Lesson({ questions, onComplete }: LessonProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowFeedback(false);
        setInputValue('');
      } else {
        onComplete(score);
      }
    }, 1500);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnswer(inputValue);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-lg font-semibold text-primary">
            Score: {score}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card">
        <h3 className="text-2xl font-bold mb-6">{currentQ.question}</h3>
        
        {currentQ.type === 'multiple-choice' && (
          <div className="grid grid-cols-2 gap-4">
            {currentQ.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={`p-4 rounded-lg border-2 transition-all ${
                  showFeedback
                    ? option === currentQ.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-primary'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQ.type === 'translate' && (
          <div className="space-y-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer..."
              className="w-full p-3 border-2 rounded-lg focus:border-primary focus:outline-none"
            />
            <button
              onClick={() => handleAnswer(inputValue)}
              className="btn-primary w-full"
            >
              Check
            </button>
          </div>
        )}

        {showFeedback && (
          <div className="mt-6 text-center">
            <p className={`text-xl font-semibold ${
              score === currentQuestion + 1 ? 'text-blue-500' : 'text-red-500'
            }`}>
              {score === currentQuestion + 1 ? 'Correct!' : 'Try again!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 