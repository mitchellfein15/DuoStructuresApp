import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { updateStreak } from "@/lib/streak";

export async function GET() {
  try {
    console.log("Starting streak GET request");
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.id) {
      console.log("No session or user ID found");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        streakCount: true,
        lastStreakDate: true,
      },
    });

    console.log("User found:", user);

    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      streakCount: user.streakCount,
      lastStreakDate: user.lastStreakDate,
    });
  } catch (error) {
    console.error("Error in streak GET:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log("Starting streak update request");
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.id) {
      console.log("No session or user ID found");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("Updating streak for user:", session.user.id);
    const updatedUser = await updateStreak(session.user.id);
    console.log("Updated user:", updatedUser);

    if (!updatedUser) {
      console.log("Failed to update streak");
      return NextResponse.json(
        { message: "Failed to update streak" },
        { status: 500 }
      );
    }

    // Return the updated streak data
    return NextResponse.json({
      streakCount: updatedUser.streakCount,
      lastStreakDate: updatedUser.lastStreakDate,
      success: true
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 