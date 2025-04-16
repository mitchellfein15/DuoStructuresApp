import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    console.log("GET XP - Session:", session);

    if (!session?.user?.id) {
      console.log("GET XP - Unauthorized: No session or user ID");
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

    console.log("GET XP - User found:", user);

    if (!user) {
      console.log("GET XP - User not found");
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ xp: user.xp });
  } catch (error) {
    console.error("GET XP - Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("POST XP - Session:", session);

    if (!session?.user?.id) {
      console.log("POST XP - Unauthorized: No session or user ID");
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { xp } = await req.json();
    console.log("POST XP - Request body:", { xp });

    if (typeof xp !== "number") {
      console.log("POST XP - Invalid XP value");
      return NextResponse.json(
        { message: "Invalid XP value" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        xp: {
          increment: xp,
        },
      },
    });

    console.log("POST XP - User updated:", user);

    return NextResponse.json({ xp: user.xp });
  } catch (error) {
    console.error("POST XP - Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 