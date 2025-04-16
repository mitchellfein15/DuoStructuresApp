'use client';

import { useState } from 'react';
import { topics, Topic, Lesson } from '@/data/lessons';
import Link from 'next/link';

export default function TopicsList() {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  const toggleTopic = (topicId: string) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Data Structures & Algorithms</h1>
      <div className="space-y-4">
        {topics.map((topic) => (
          <div key={topic.id} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleTopic(topic.id)}
              className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
            >
              <div className="text-left">
                <h2 className="text-xl font-semibold">{topic.title}</h2>
                <p className="text-gray-600">{topic.description}</p>
              </div>
              <svg
                className={`w-6 h-6 transform transition-transform ${
                  expandedTopic === topic.id ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {expandedTopic === topic.id && (
              <div className="p-4 space-y-4">
                {topic.lessons.map((lesson) => (
                  <div key={lesson.id} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-medium">{lesson.title}</h3>
                    <p className="text-gray-600 mb-2">{lesson.description}</p>
                    <Link
                      href={`/learn/${topic.id}/${lesson.id}`}
                      className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Start Lesson
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 