'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LeaderboardUser {
  id: string;
  name: string | null;
  xp: number;
  streakCount: number;
  rank: number;
}

export default function LeaderboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchLeaderboard() {
      if (status === "authenticated" && !isFetching) {
        try {
          setIsFetching(true);
          console.log("Fetching leaderboard data");
          
          const response = await fetch("/api/leaderboard");
          console.log("API response status:", response.status);

          if (!response.ok) {
            throw new Error(`Failed to fetch leaderboard: ${response.status}`);
          }

          const data = await response.json();
          console.log("Received leaderboard data:", data);
          setUsers(data);
        } catch (error) {
          console.error("Error fetching leaderboard:", error);
          setError(error instanceof Error ? error.message : "Failed to load leaderboard");
        } finally {
          setIsLoading(false);
          setIsFetching(false);
        }
      }
    }

    fetchLeaderboard();
  }, [status]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Leaderboard</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
            <p className="mt-1 text-sm text-gray-500">Top performers ranked by XP</p>
          </div>
          <div className="border-t border-gray-200">
            {users.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                No users found on the leaderboard yet.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {users.map((user) => (
                  <li
                    key={user.id}
                    className={`px-4 py-4 sm:px-6 ${
                      session?.user?.id === user.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-600">
                              {user.rank}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || "Anonymous"}
                            {session?.user?.id === user.id && (
                              <span className="ml-2 text-blue-600">(You)</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                              {user.xp} XP
                            </div>
                            {user.streakCount > 0 && (
                              <div className="flex items-center text-sm text-orange-500">
                                <span className="mr-1">🔥</span>
                                {user.streakCount} day streak
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">
                          Rank #{user.rank}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 