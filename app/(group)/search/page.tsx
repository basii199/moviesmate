"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { searchMovies } from "@/lib/tmdb";
import { MovieGrid } from "@/components/MovieGrid";

export default function SearchMoviesPage (){
  return(
    <Suspense fallback={<div>Please wait...</div>}>
      <SearchMoviesComponent />
    </Suspense>
  )
}

function SearchMoviesComponent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery(query);
  }, [query]);

  useEffect(() => {
    const loadMovies = async () => {
      if (!searchQuery) return;

      setLoading(true);
      try {
        const data = await searchMovies(searchQuery, currentPage);
        setMovies(data.results);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages);
      } catch (error) {
        console.error("Failed to search movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [searchQuery, currentPage]);

  if (!searchQuery) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-gray-900">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-300 mb-2">
            No search query entered
          </h2>
          <p className="text-gray-500">
            Try searching for a movie using the search bar
          </p>
        </div>
      </div>
    );
  }

  return (
    <MovieGrid
      movies={movies}
      loading={loading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      title={`Search: "${searchQuery}"`}
    />
  );
}