"use client";

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const HeroSection = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchText.trim())}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Discover, Watch, Enjoy
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Browse thousands of movies from TMDB. Find ratings, trailers, and recommendations in one place.
        </p>
        
        <form onSubmit={handleSubmit} className="mb-8 max-w-md mx-auto">
          <div className="flex rounded-lg overflow-hidden shadow-lg">
            <input
              type="text"
              placeholder="Search for movies..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-grow px-4 py-3 text-gray-100 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-gray-500"
              aria-label="Search movies"
              required
            />
            <button 
              type="submit"
              className="bg-red-600 hover:bg-red-700 px-6 py-3 font-semibold transition-colors"
              aria-label="Submit search"
            >
              Search
            </button>
          </div>
        </form>
        
        <Link
          href="/movies"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors shadow-lg"
        >
          Explore Movies Now
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;