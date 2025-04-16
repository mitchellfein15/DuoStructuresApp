import { prisma } from "./prisma";

export async function saveProgress(
  userId: string,
  lessonId: string,
  score: number
) {
  try {
    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      update: {
        score: Math.max(score, 0),
        completed: true,
      },
      create: {
        userId,
        lessonId,
        score: Math.max(score, 0),
        completed: true,
      },
    });

    return progress;
  } catch (error) {
    console.error("Error saving progress:", error);
    throw error;
  }
}

export async function getProgress(userId: string, lessonId: string) {
  try {
    const progress = await prisma.progress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    return progress;
  } catch (error) {
    console.error("Error getting progress:", error);
    throw error;
  }
}

export async function getUserProgress(userId: string) {
  try {
    const progress = await prisma.progress.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return progress;
  } catch (error) {
    console.error("Error getting user progress:", error);
    throw error;
  }
} 