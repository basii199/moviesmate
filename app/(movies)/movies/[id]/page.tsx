"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import YouTube from "react-youtube";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Star, Heart, Bookmark, ChevronLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Skeleton from "react-loading-skeleton";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
  videos?: { results: { key: string; type: string }[] };
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
}

const MovieDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "cast">("overview");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`
        );
        const data = await response.json();
        setMovie(data);

        const trailer = data.videos?.results.find(
          (video: { type: string }) => video.type === "Trailer"
        ) || data.videos?.results[0];
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        toast.error("Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    const checkUserFavoritesAndBookmarks = async () => {
      if (!user) return;

      try {
        const [{ data: favoriteData }, { data: bookmarkData }] = await Promise.all([
          supabase
            .from("favorites")
            .select("id")
            .eq("user_id", user.id)
            .eq("movie_id", id),
          supabase
            .from("bookmarks")
            .select("id")
            .eq("user_id", user.id)
            .eq("movie_id", id)
        ]);

        setIsFavorite(favoriteData?.length > 0);
        setIsBookmarked(bookmarkData?.length > 0);
      } catch (error) {
        console.error("Error checking favorites/bookmarks:", error);
      }
    };

    fetchMovieDetails();
    checkUserFavoritesAndBookmarks();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) {
      toast.warning("Please sign in to add favorites");
      return router.push("/login");
    }

    try {
      if (isFavorite) {
        await supabase.from("favorites").delete().match({ user_id: user.id, movie_id: id });
        toast.success("Removed from favorites");
      } else {
        await supabase.from("favorites").insert({
          user_id: user.id,
          movie_id: movie?.id,
          title: movie?.title,
          poster_path: movie?.poster_path,
        });
        toast.success("Added to favorites");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      toast.warning("Please sign in to bookmark movies");
      return router.push("/login");
    }

    try {
      if (isBookmarked) {
        await supabase.from("bookmarks").delete().match({ user_id: user.id, movie_id: id });
        toast.success("Removed bookmark");
      } else {
        await supabase.from("bookmarks").insert({
          user_id: user.id,
          movie_id: movie?.id,
          title: movie?.title,
          poster_path: movie?.poster_path,
        });
        toast.success("Movie bookmarked");
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmarks");
    }
  };

  const formatRuntime = (minutes: number | undefined) => {
    if (!minutes) return "";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) return <MovieDetailsSkeleton />;
  if (!movie) return <div className="text-center mt-10">Movie not found</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100">
      {/* Backdrop Image */}
      <div className="relative h-64 md:h-96 w-full">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover opacity-50"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800" />
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent h-32" />
        
        <div className="container relative z-10 h-full flex flex-col justify-end pb-8">
          <Button 
            variant="ghost" 
            className="absolute top-4 left-4 w-10 h-10 p-0 rounded-full bg-gray-800 hover:bg-gray-700"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>
          
          <div className="flex items-center gap-4 text-sm md:text-base">
            <span>{new Date(movie.release_date).getFullYear()}</span>
            {movie.runtime && <span>{formatRuntime(movie.runtime)}</span>}
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Poster and Actions */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/no-poster.jpg"
                }
                alt={movie.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            <div className="mt-4 flex gap-2">
              <Button
                variant={isFavorite ? "passive" : "active"}
                className="flex-1 gap-2"
                onClick={toggleFavorite}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                {isFavorite ? "Favorited" : "Favorite"}
              </Button>
              
              <Button
                variant={isBookmarked ? "passive" : "active"}
                className="flex-1 gap-2"
                onClick={toggleBookmark}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                {isBookmarked ? "Saved" : "Save"}
              </Button>
            </div>
            
            {movie.genres && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span 
                      key={genre.id}
                      className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Content */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {/* Tabs */}
            <div className="flex border-b border-gray-800 mb-6">
              <button
                className={`px-4 py-2 font-medium ${activeTab === "overview" ? "text-red-500 border-b-2 border-red-500" : "text-gray-400 hover:text-white"}`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === "cast" ? "text-red-500 border-b-2 border-red-500" : "text-gray-400 hover:text-white"}`}
                onClick={() => setActiveTab("cast")}
              >
                Cast
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Storyline</h2>
                <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                
                {trailerKey && (
                  <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Trailer</h2>
                    <div className="aspect-video w-full bg-black rounded-lg overflow-hidden relative">
                      <YouTube
                        videoId={trailerKey}
                        opts={{
                          width: "100%",
                          height: "100%",
                          playerVars: {
                            autoplay: 0,
                            modestbranding: 1,
                            rel: 0,
                          },
                        }}
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {movie.credits?.cast.slice(0, 8).map((person) => (
                  <div key={person.id} className="text-center">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                      {person.profile_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        ''
                      )}
                    </div>
                    <h3 className="font-medium">{person.name}</h3>
                    <p className="text-sm text-gray-400">{person.character}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MovieDetailsSkeleton = () => {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="relative h-64 md:h-96 w-full bg-gray-800">
        <Skeleton className="absolute bottom-8 left-8 h-12 w-3/4" />
      </div>
      
      <div className="container max-w-6xl py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <Skeleton className="aspect-[2/3] rounded-lg" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
          
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
            
            <div className="space-y-3">
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;