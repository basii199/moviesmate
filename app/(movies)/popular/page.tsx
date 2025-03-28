// app/popular/page.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchMoviesFull } from "@/lib/tmdb";
import { MovieGrid } from "@/components/MovieGrid";

export default function PopularMoviesPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const data = await fetchMoviesFull("popular", currentPage);
        setMovies(data.results);
        setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); // TMDB limits to 500 pages
      } catch (error) {
        console.error("Failed to load movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [currentPage]);

  return (
    <MovieGrid
      movies={movies}
      loading={loading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      title="Popular"
    />
  );
}