import "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      xp?: number;
      streakCount?: number;
      lastStreakDate?: Date | null;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    xp?: number;
    streakCount?: number;
    lastStreakDate?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    xp?: number;
    streakCount?: number;
    lastStreakDate?: Date | null;
  }
} 