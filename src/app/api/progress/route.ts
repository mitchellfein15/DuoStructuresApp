import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { lessonId, score } = await req.json();

    if (!lessonId || typeof score !== "number") {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        score: Math.max(score, 0),
        completed: true,
      },
      create: {
        userId: session.user.id,
        lessonId,
        score: Math.max(score, 0),
        completed: true,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get("lessonId");

    if (lessonId) {
      const progress = await prisma.progress.findUnique({
        where: {
          userId_lessonId: {
            userId: session.user.id,
            lessonId,
          },
        },
      });

      return NextResponse.json(progress);
    }

    const progress = await prisma.progress.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error getting progress:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 