"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();
  const [xp, setXp] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchUserData() {
      if (status === "authenticated" && !isUpdating && Date.now() - lastUpdateTime > 5000) {
        try {
          setIsUpdating(true);
          console.log("Fetching user data for:", session?.user?.id);
          
          const [xpResponse, streakResponse] = await Promise.all([
            fetch("/api/user/xp"),
            fetch("/api/user/streak")
          ]);

          if (!xpResponse.ok || !streakResponse.ok) {
            throw new Error("Failed to fetch user data");
          }

          const xpData = await xpResponse.json();
          const streakData = await streakResponse.json();
          
          setXp(xpData.xp);
          setLastUpdateTime(Date.now());
          
          // Only update session if the data has changed
          if (session?.user?.xp !== xpData.xp || 
              session?.user?.streakCount !== streakData.streakCount) {
            await updateSession({
              ...session,
              user: {
                ...session?.user,
                xp: xpData.xp,
                streakCount: streakData.streakCount,
                lastStreakDate: streakData.lastStreakDate,
              },
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setError(error instanceof Error ? error.message : "Failed to load user data");
        } finally {
          setIsLoading(false);
          setIsUpdating(false);
        }
      }
    }

    fetchUserData();
  }, [status, session?.user?.id, updateSession, lastUpdateTime]);

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
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {session?.user?.name?.[0] || "U"}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{session?.user?.name || "User"}</h1>
              <p className="text-gray-600">{session?.user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Problems Solved</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Current Streak</h3>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-bold text-blue-600">
                  {session?.user?.streakCount || 0} day(s)
                </p>
                {session?.user?.streakCount && session.user.streakCount > 0 && (
                  <span className="text-2xl">🔥</span>
                )}
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Total XP</h3>
              <p className="text-3xl font-bold text-blue-600">{xp}</p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Progress Overview</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Data Structures</span>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Algorithms</span>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Problem Solving</span>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "0%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 