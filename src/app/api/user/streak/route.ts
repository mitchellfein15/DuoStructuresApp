import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";
import { updateStreak } from "@/lib/streak";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const updatedUser = await updateStreak(session.user.id);

    if (!updatedUser) {
      return NextResponse.json(
        { message: "Failed to update streak" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      streakCount: updatedUser.streakCount,
      lastStreakDate: updatedUser.lastStreakDate,
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 