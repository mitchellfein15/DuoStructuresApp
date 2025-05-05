import { NextResponse } from 'next/server';
import { topics } from '@/data/lessons';

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

    // Find the topic and lesson
    const topicData = topics.find(t => t.id === topic);
    if (!topicData) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    const lessonData = topicData.lessons.find(l => l.id === lesson);
    if (!lessonData) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    const questions = lessonData.questions;
    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions available for this lesson' },
        { status: 404 }
      );
    }

    // In practice mode, return a random question
    if (mode === 'practice') {
      const randomIndex = Math.floor(Math.random() * questions.length);
      return NextResponse.json(questions[randomIndex]);
    }

    // In lesson mode, return questions in order
    const questionIndex = Math.min(
      Math.floor(Math.random() * questions.length),
      questions.length - 1
    );
    return NextResponse.json(questions[questionIndex]);
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { error: 'Server Error' },
      { status: 500 }
    );
  }
} 