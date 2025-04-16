'use client';

import { useState } from 'react';
import Lesson from '@/components/Lesson';

const sampleQuestions = [
  {
    type: 'multiple-choice' as const,
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 'O(log n)',
  },
  {
    type: 'multiple-choice' as const,
    question: 'Which data structure uses LIFO (Last In, First Out) principle?',
    options: ['Queue', 'Stack', 'Heap', 'Tree'],
    correctAnswer: 'Stack',
  },
  {
    type: 'multiple-choice' as const,
    question: 'What is the space complexity of a recursive Fibonacci implementation?',
    options: ['O(1)', 'O(n)', 'O(2^n)', 'O(log n)'],
    correctAnswer: 'O(n)',
  },
];

export default function LearnPage() {
  const [showLesson, setShowLesson] = useState(true);

  const handleLessonComplete = (score: number) => {
    alert(`Lesson completed! Your score: ${score}/${sampleQuestions.length}`);
    setShowLesson(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Lesson
          questions={sampleQuestions}
          onComplete={handleLessonComplete}
        />
      </div>
    </div>
  );
} 