import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface LeaderboardUser {
  id: string;
  name: string | null;
  xp: number;
  streakCount: number;
  rank: number;
}

export async function GET() {
  try {
    console.log("Starting leaderboard API request");
    const session = await getServerSession(authOptions);
    console.log("Full session object:", JSON.stringify(session, null, 2));
    console.log("Session user:", session?.user);
    console.log("Session user ID:", session?.user?.id);

    if (!session?.user?.id) {
      console.log("No session or user ID found - returning 401");
      return new NextResponse(
        JSON.stringify({ error: "You must be logged in to view the leaderboard" }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log("Fetching users from database");
    // Get all users ordered by XP
    const users = await prisma.user.findMany({
      orderBy: {
        xp: 'desc',
      },
    });

    console.log("Found users:", users.length);

    if (!users || users.length === 0) {
      console.log("No users found - returning 404");
      return new NextResponse(
        JSON.stringify({ error: "No users found" }),
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Transform users to leaderboard format
    const leaderboardUsers: LeaderboardUser[] = users.map((user, index) => ({
      id: user.id,
      name: user.name,
      xp: user.xp,
      streakCount: user.streakCount,
      rank: index + 1,
    }));

    console.log("Returning leaderboard data");
    return new NextResponse(
      JSON.stringify(leaderboardUsers),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Error in leaderboard API:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch leaderboard data" }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
} 