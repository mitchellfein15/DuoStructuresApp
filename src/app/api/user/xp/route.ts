import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    console.log("Starting XP GET request");
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
        xp: true,
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

    return NextResponse.json({ xp: user.xp });
  } catch (error) {
    console.error("Error in XP GET:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log("Starting XP POST request");
    const session = await getServerSession(authOptions);
    console.log("Session:", session);

    if (!session?.user?.id) {
      console.log("No session or user ID found");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { xp } = await req.json();
    console.log("Request body:", { xp });

    if (typeof xp !== "number") {
      console.log("Invalid XP value");
      return NextResponse.json(
        { message: "Invalid XP value" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        xp: {
          increment: xp,
        },
      },
    });

    // Fetch the updated user data
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    console.log("User updated:", user);

    return NextResponse.json({
      xp: user?.xp,
      streakCount: user?.streakCount,
      lastStreakDate: user?.lastStreakDate,
    });
  } catch (error) {
    console.error("Error in XP POST:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 