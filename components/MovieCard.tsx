"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
    release_date?: string;
    vote_average?: number;
  };
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className = "" }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` // Smaller image size
    : "/no-poster.jpg";

  return (
    <Link 
      href={`/movies/${movie.id}`}
      className={`${className} group relative block aspect-[2/3] overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:z-10 hover:shadow-xl hover:shadow-red-900/30`}
    >
      {/* Movie Poster with optimized sizes */}
      <Image
        src={imageUrl}
        alt={movie.title}
        width={342} // Matches w342 above
        height={513} // 342 * 1.5 (2:3 ratio)
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" // Reduced scale effect
        sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, 220px"
        unoptimized
      />

      {/* Overlay - Only shows on larger screens */}
      <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="mb-1 line-clamp-2 text-sm md:text-base font-bold text-white">
            {movie.title}
          </h3>
          
          <div className="flex items-center justify-between">
            {movie.release_date && (
              <span className="text-xs text-gray-300">
                {new Date(movie.release_date).getFullYear()}
              </span>
            )}
            
            {movie.vote_average && (
              <div className="flex items-center gap-1">
                <StarIcon className="h-3 w-3 text-yellow-400" />
                <span className="text-xs font-semibold text-white">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

// Simple star icon component
const StarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
      clipRule="evenodd"
    />
  </svg>
);

export default MovieCard;

/* "use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string;
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/placeholder.jpg";

  return (
    <Link href={`/home/${movie.id}`} className="block bg-white shadow-lg rounded-lg overflow-hidden">
      <Image
        src={imageUrl}
        alt={movie.title}
        width={500}
        height={750}
        className="w-full h-auto"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
      </div>
    </Link>
  );
};

export default MovieCard;
 */