'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { topics } from "@/data/lessons";
import Link from "next/link";

interface PracticePageProps {
  params: {
    topicId: string;
  };
}

export default function PracticePage({ params }: PracticePageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<typeof topics[0]['lessons'][0]['questions']>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const topic = topics.find((t) => t.id === params.topicId);
    if (topic) {
      // Combine all questions from all lessons in this topic
      const allQuestions = topic.lessons.flatMap(lesson => lesson.questions);
      // Shuffle the questions
      const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);
    }
  }, [params.topicId]);

  const topic = topics.find((t) => t.id === params.topicId);

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Topic not found</h1>
          <Link href="/practice" className="text-blue-600 hover:text-blue-800">
            Return to practice
          </Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/practice"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to practice
          </Link>
          <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
          <p className="text-gray-600 mb-4">{topic.description}</p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
            <p className="text-gray-600">
              Score: {score} / {currentQuestionIndex + 1}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-medium mb-4">{currentQuestion.question}</h3>
          <div className="space-y-3">
            {currentQuestion.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 text-left rounded-lg border ${
                  selectedAnswer === option
                    ? option === currentQuestion.correctAnswer
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Explanation:</h4>
              <p className="text-gray-600">
                {selectedAnswer === currentQuestion.correctAnswer
                  ? 'Correct! ' + currentQuestion.explanation
                  : 'Incorrect. The correct answer is: ' + currentQuestion.correctAnswer + '. ' + currentQuestion.explanation}
              </p>
              {!isLastQuestion && (
                <button
                  onClick={handleNextQuestion}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Next Question
                </button>
              )}
            </div>
          )}

          {isLastQuestion && showExplanation && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-xl font-medium mb-2">Practice Complete!</h4>
              <p className="text-gray-600 mb-4">
                Your final score: {score} / {questions.length}
              </p>
              <div className="space-x-4">
                <Link
                  href="/practice"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Return to practice
                </Link>
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setSelectedAnswer(null);
                    setShowExplanation(false);
                    setScore(0);
                    setQuestions([...questions].sort(() => Math.random() - 0.5));
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 