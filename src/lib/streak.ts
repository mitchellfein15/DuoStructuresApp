import { prisma } from "./prisma";

export async function updateStreak(userId: string) {
  try {
    console.log("Starting streak update for user:", userId);
    // Get the current date in the user's local timezone
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log("User not found");
      return null;
    }

    console.log("Current user data:", {
      streakCount: user.streakCount,
      lastStreakDate: user.lastStreakDate
    });

    const lastStreakDate = user.lastStreakDate;
    let newStreak = user.streakCount;

    if (lastStreakDate) {
      // Convert lastStreakDate to local date (removing time component)
      const last = new Date(lastStreakDate);
      const lastLocal = new Date(last.getFullYear(), last.getMonth(), last.getDate());
      
      // Calculate the difference in days
      const diffTime = today.getTime() - lastLocal.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      console.log('Last streak date:', lastLocal);
      console.log('Today:', today);
      console.log('Difference in days:', diffDays);
      
      if (diffDays === 1) {
        // Yesterday was the last streak, continue it
        newStreak += 1;
        console.log('Continuing streak:', newStreak);
      } else if (diffDays > 1) {
        // Streak broken, reset to 0
        newStreak = 0;
        console.log('Streak broken, resetting to 0');
      } else if (diffDays === 0) {
        // Same day, don't update streak
        console.log('Same day, keeping streak at:', newStreak);
      }
    } else {
      // First streak
      newStreak = 1;
      console.log('First streak');
    }

    // Update the user's streak
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        streakCount: newStreak,
        lastStreakDate: today,
      },
    });

    console.log("Updated user data:", {
      streakCount: updatedUser.streakCount,
      lastStreakDate: updatedUser.lastStreakDate
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating streak:", error);
    return null;
  }
} 