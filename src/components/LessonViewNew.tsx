'use client';

import { useState, useEffect } from 'react';
import { topics, Topic, Lesson } from '@/data/lessons';
import Link from 'next/link';

// TEST LOG - This should appear in console when component loads
console.log("TEST: New LessonView component loaded!");

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface LessonViewProps {
  topicId: string;
  lessonId: string;
}

export default function LessonViewNew({ topicId, lessonId }: LessonViewProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [showXpNotification, setShowXpNotification] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const topic = topics.find((t) => t.id === topicId);
  const lesson = topic?.lessons.find((l) => l.id === lessonId);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!topic || !lesson) {
        setError('Topic or lesson not found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/generate-question', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic: topic.id,
            lesson: lesson.id
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch question');
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setCurrentQuestion(data);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load question');
        setIsLoading(false);
      }
    };

    fetchQuestion();
  }, [topic, lesson]);

  const handleAnswerSelect = async (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    setQuestionsAnswered(prev => prev + 1);
    
    if (answer === currentQuestion?.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = async () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    // If this was the last question, award XP and complete the lesson
    if (questionsAnswered >= 5) {
      await awardXp();
      setLessonCompleted(true);
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/generate-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic?.id,
          lesson: lesson?.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch next question');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setCurrentQuestion(data);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load next question');
      setIsLoading(false);
    }
  };

  const awardXp = async () => {
    if (!lessonCompleted) {
      const xpEarned = 10;
      setEarnedXp(xpEarned);
      setShowXpNotification(true);
      setLessonCompleted(true);
      
      try {
        // Update XP
        const xpResponse = await fetch("/api/user/xp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ xp: xpEarned }),
        });

        if (!xpResponse.ok) {
          throw new Error(`Failed to update XP: ${xpResponse.status} ${xpResponse.statusText}`);
        }

        // Update streak
        const streakResponse = await fetch("/api/user/streak", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!streakResponse.ok) {
          console.error("Failed to update streak:", await streakResponse.text());
        }
      } catch (error) {
        console.error("Error updating progress:", error);
        setShowXpNotification(false);
      }
    }
  };

  if (!topic || !lesson) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Lesson not found</h1>
        <Link href="/" className="text-blue-500 hover:text-blue-700">
          Return to topics
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">Error Loading Question</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              fetch('/api/generate-question', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  topic: topic?.id,
                  lesson: lesson?.id
                }),
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Failed to fetch question');
                }
                return response.json();
              })
              .then(data => {
                if (data.error) {
                  throw new Error(data.error);
                }
                setCurrentQuestion(data);
                setIsLoading(false);
              })
              .catch(err => {
                setError(err instanceof Error ? err.message : 'Failed to load question');
                setIsLoading(false);
              });
            }}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {showXpNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-out">
          <p className="font-semibold">+{earnedXp} XP Earned!</p>
        </div>
      )}
      
      <div className="mb-8">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">
          ← Back to topics
        </Link>
        <h1 className="text-3xl font-bold mb-2">{topic.title}</h1>
        <h2 className="text-2xl font-semibold mb-4">{lesson.title}</h2>
        <p className="text-gray-600 mb-4">{lesson.description}</p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="font-medium">Score: {score} / {questionsAnswered}</p>
          <p className="text-sm text-gray-600 mt-1">
            Questions answered: {questionsAnswered} / 5
          </p>
        </div>
      </div>

      {lessonCompleted ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-2xl font-bold text-green-600 mb-4">Lesson Completed!</h3>
          <p className="text-gray-600 mb-6">You've earned {earnedXp} XP for completing this lesson.</p>
          <Link
            href="/lessons"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Lessons
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-medium mb-4">{currentQuestion.question}</h3>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
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
                  : 'Incorrect. ' + currentQuestion.explanation}
              </p>
              <button
                onClick={handleNextQuestion}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {questionsAnswered >= 4 ? 'Complete Lesson' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 