import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function updateStreak(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return null;

  const lastStreakDate = user.lastStreakDate;
  let newStreak = user.streakCount;

  if (lastStreakDate) {
    const last = new Date(lastStreakDate);
    last.setHours(0, 0, 0, 0);
    
    const diff = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 1) {
      // Yesterday was the last streak, continue it
      newStreak += 1;
    } else if (diff > 1) {
      // Streak broken, start new streak
      newStreak = 1;
    }
    // If diff === 0, it's the same day, don't update streak
  } else {
    // First streak
    newStreak = 1;
  }

  // Update the user's streak
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      streakCount: newStreak,
      lastStreakDate: today,
    },
  });

  return updatedUser;
} 