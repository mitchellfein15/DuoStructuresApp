import { NextResponse } from 'next/server';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Questions {
  [topic: string]: {
    [lesson: string]: Question[];
  };
}

// Pre-defined questions
const QUESTIONS: Questions = {
  'intro-analysis': {
    'big-o-notation': [
      {
        question: "What is the time complexity of a binary search algorithm?",
        options: [
          "O(1)",
          "O(log n)",
          "O(n)",
          "O(n²)"
        ],
        correctAnswer: "O(log n)",
        explanation: "Binary search divides the search space in half with each iteration, resulting in a logarithmic time complexity."
      },
      {
        question: "Which of these operations has O(1) time complexity?",
        options: [
          "Accessing an element in an array by index",
          "Searching for an element in an unsorted array",
          "Sorting an array using bubble sort",
          "Finding the maximum element in a binary heap"
        ],
        correctAnswer: "Accessing an element in an array by index",
        explanation: "Array access by index is a constant-time operation because it directly calculates the memory address."
      },
      {
        question: "What is the time complexity of bubble sort in the worst case?",
        options: [
          "O(n)",
          "O(n log n)",
          "O(n²)",
          "O(2ⁿ)"
        ],
        correctAnswer: "O(n²)",
        explanation: "Bubble sort requires n-1 passes through the array, and each pass requires n-1 comparisons, resulting in O(n²) time complexity."
      }
    ]
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, lesson, mode = 'lesson' } = body;

    if (!topic || !lesson) {
      return NextResponse.json(
        { error: 'Topic and lesson are required' },
        { status: 400 }
      );
    }

    const topicQuestions = QUESTIONS[topic]?.[lesson];
    if (!topicQuestions) {
      return NextResponse.json(
        { error: 'No questions available for this topic and lesson' },
        { status: 404 }
      );
    }

    // In practice mode, return a random question
    if (mode === 'practice') {
      const randomIndex = Math.floor(Math.random() * topicQuestions.length);
      return NextResponse.json(topicQuestions[randomIndex]);
    }

    // In lesson mode, return questions in order
    const questionIndex = Math.min(
      Math.floor(Math.random() * topicQuestions.length),
      topicQuestions.length - 1
    );
    return NextResponse.json(topicQuestions[questionIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Server Error' },
      { status: 500 }
    );
  }
} 