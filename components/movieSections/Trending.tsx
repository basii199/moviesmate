"use client";

import React, { useEffect, useState } from "react";
import { getTrendingMovies } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import Skeleton from 'react-loading-skeleton';

const TrendingMovies = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getTrendingMovies();
        if (data) setMovies(data.results.slice(0, 10));
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <section className="bg-gray-900 py-8 sm:py-12 px-4 sm:px-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Trending <span className="text-red-500">Today</span>
          </h2>
          <a 
            href="/trending" 
            className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm font-semibold"
          >
            View All →
          </a>
        </div>

        {loading ? (
          <div className="flex gap-3 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <Skeleton 
                key={i} 
                className="h-[180px] w-[120px] sm:h-[225px] sm:w-[150px] rounded-lg bg-gray-800" 
              />
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="flex gap-3 pb-1 overflow-x-auto scrollbar-hide">
              {movies.map((movie) => (
                <div 
                  key={movie.id}
                  className="flex-none w-[120px] sm:w-[150px] md:w-[180px]"
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingMovies;