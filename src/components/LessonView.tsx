'use client';

import { useState, useEffect } from 'react';
import { topics, Topic, Lesson } from '@/data/lessons';
import Link from 'next/link';

// TEST LOG - This should appear in console when component loads
console.log("TEST: LessonView component loaded!");

interface Question {
  type: 'multiple-choice' | 'translate' | 'listen';
  question: string;
  options?: string[];
  correctAnswer: string;
  audioUrl?: string;
}

interface LessonViewProps {
  topicId: string;
  lessonId: string;
}

export default function LessonView({ topicId, lessonId }: LessonViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [showXpNotification, setShowXpNotification] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);

  const topic = topics.find((t) => t.id === topicId);
  const lesson = topic?.lessons.find((l) => l.id === lessonId);

  useEffect(() => {
    console.log("LessonView mounted");
    console.log("Current question index:", currentQuestionIndex);
    console.log("Total questions:", lesson?.questions.length);
  }, [currentQuestionIndex, lesson]);

  if (!topic || !lesson) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Lesson not found</h1>
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-700"
        >
          Return to topics
        </Link>
      </div>
    );
  }

  const currentQuestion = lesson.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === lesson.questions.length - 1;

  const awardXp = async () => {
    if (!lessonCompleted) {
      console.log("Attempting to award XP...");
      const xpEarned = 10;
      setEarnedXp(xpEarned);
      setShowXpNotification(true);
      setLessonCompleted(true);
      
      try {
        console.log("Sending XP update request...");
        const response = await fetch("/api/user/xp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ xp: xpEarned }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to update XP:", errorData);
          throw new Error(`Failed to update XP: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("XP update successful:", data);
      } catch (error) {
        console.error("Error updating XP:", error);
        setShowXpNotification(false);
      }
    }
  };

  const handleAnswerSelect = async (answer: string) => {
    console.log("Answer selected:", answer);
    console.log("Correct answer:", currentQuestion.correctAnswer);
    console.log("Is last question:", isLastQuestion);
    
    setSelectedAnswer(answer);
    setShowExplanation(true);
    
    if (answer === currentQuestion.correctAnswer) {
      console.log("Answer is correct!");
      setScore(score + 1);
      
      if (isLastQuestion) {
        console.log("Last question answered correctly, awarding XP...");
        await awardXp();
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      {showXpNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          <p className="font-semibold">+{earnedXp} XP Earned!</p>
        </div>
      )}
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-700 mb-4 inline-block"
        >
          ← Back to topics
        </Link>
        <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
        <h2 className="text-2xl font-semibold mb-4">{lesson.title}</h2>
        <p className="text-gray-600 mb-4">{lesson.description}</p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="font-medium">
            Question {currentQuestionIndex + 1} of {lesson.questions.length}
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
                ? 'Correct! ' + currentQuestion.correctAnswer
                : 'Incorrect. The correct answer is: ' + currentQuestion.correctAnswer}
            </p>
            {!isLastQuestion && (
              <button
                onClick={handleNextQuestion}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Next Question
              </button>
            )}
          </div>
        )}

        {isLastQuestion && showExplanation && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-xl font-medium mb-2">Lesson Complete!</h4>
            <p className="text-gray-600 mb-4">
              Your final score: {score} / {lesson.questions.length}
            </p>
            <Link
              href="/"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Return to topics
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 