"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import  MovieCard  from "@/components/MovieCard";
import Skeleton from "react-loading-skeleton";
import { Button } from "@/components/ui/button";
import { Bookmark, Heart, User, Settings, X } from "lucide-react";
import { toast } from "sonner";
import { getUserDisplayName } from "@/lib/auth";
import Image from "next/image";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"favorites" | "bookmarks">("favorites");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);

        const { data } = await supabase
          .from(activeTab === "favorites" ? "favorites" : "bookmarks")
          .select("movie_data")
          .eq("user_id", user.id);

        setMovies(data?.map((item) => item.movie_data) || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load your data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, activeTab]);

  useEffect(() => {
    if (user) {
      const fetchDisplayName = async () => {
        const name = await getUserDisplayName();
        setDisplayName(name);
      };
      fetchDisplayName();
    }
  }, [user, getUserDisplayName]);

  const removeFromList = async (movieId: number) => {
    try {
      await supabase
        .from(activeTab === "favorites" ? "favorites" : "bookmarks")
        .delete()
        .match({ user_id: user?.id, movie_id: movieId });

      setMovies(movies.filter((movie) => movie.id !== movieId));
      toast.success(`Removed from ${activeTab}`);
    } catch (error) {
      console.error("Error removing movie:", error);
      toast.error("Failed to remove movie");
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h2>
        <Button onClick={() => window.location.href = "/sign-in"}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="relative size-24 rounded-full bg-gray-800 flex items-center justify-center">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name || "User"}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-gray-400" />
            )}
          </div>
          
          <div>
            <h1 className="text-3xl font-bold">{displayName || "User"}</h1>
            <p className="text-gray-400">{user.email}</p>
            <Button variant="active" className="mt-2 gap-2" onClick={() => window.location.href = "/profile"}>
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="flex border-b border-gray-800 mb-8">
          <button
            className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === "favorites" ? "text-red-500 border-b-2 border-red-500" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("favorites")}
          >
            <Heart className="h-5 w-5" />
            Favorites ({movies.length})
          </button>
          <button
            className={`px-6 py-3 font-medium flex items-center gap-2 ${activeTab === "bookmarks" ? "text-red-500 border-b-2 border-red-500" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("bookmarks")}
          >
            <Bookmark className="h-5 w-5" />
            Bookmarks ({movies.length})
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-[2/3] rounded-lg bg-gray-800" />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-400">
              No {activeTab} movies yet
            </h3>
            <p className="text-gray-500 mt-2">
              {activeTab === "favorites" 
                ? "Mark movies as favorites to see them here"
                : "Bookmark movies to watch them later"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <div key={movie.id} className="group relative">
                <MovieCard movie={movie} />
                <button
                  onClick={() => removeFromList(movie.id)}
                  className="absolute top-2 right-2 bg-gray-900/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}