'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LessonViewNew from "@/components/LessonViewNew";

interface LessonPageProps {
  params: {
    topicId: string;
    lessonId: string;
  };
}

export default function LessonPage({ params }: LessonPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <LessonViewNew topicId={params.topicId} lessonId={params.lessonId} />;
} 