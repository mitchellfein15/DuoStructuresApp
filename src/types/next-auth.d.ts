import "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      streakCount?: number;
      lastStreakDate?: Date | null;
    };
  }

  interface JWT {
    id?: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
  }
} 