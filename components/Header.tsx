"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, User } from 'lucide-react';

const Header = () => {
  const [displayName, setDisplayName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loading, getUserDisplayName, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const fetchDisplayName = async () => {
        const name = await getUserDisplayName();
        setDisplayName(name);
      };
      fetchDisplayName();
    }
  }, [user, getUserDisplayName]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { href: "/popular", label: "Popular" },
    { href: "/trending", label: "Trending" },
    { href: "/top-rated", label: "Top Rated" },
  ];

  return (
    <>
      <header className="w-full fixed top-0 z-50 h-20 bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        {/* Logo */}
        <div className="flex items-center">
          <button 
            className="mr-4 lg:hidden text-gray-300 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/" className="text-2xl sm:text-3xl font-bold text-white hover:text-red-500 transition-colors">
            MoviesMate
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex gap-6 text-lg font-semibold mx-4">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className={`text-gray-300 hover:text-white transition-colors ${
                pathname === link.href ? "text-white font-bold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search and Auth */}
        <div className="flex items-center gap-4">
          {/* Search Button (Mobile) */}
          <button 
            className="lg:hidden text-gray-300 hover:text-white"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={24} />
          </button>

          {/* Search Bar (Desktop) */}
          <form 
            onSubmit={handleSearch}
            className="hidden lg:flex items-center relative"
          >
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 text-white rounded-full py-2 pl-4 pr-10 w-64 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button 
              type="submit"
              className="absolute right-3 text-gray-400 hover:text-white"
            >
              <Search size={20} />
            </button>
          </form>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <form 
              onSubmit={handleSearch}
              className="absolute top-20 left-0 right-0 bg-gray-900 p-3 lg:hidden flex items-center shadow-lg"
            >
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-gray-800 text-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                autoFocus
              />
              <button 
                type="button"
                className="ml-2 text-gray-400 hover:text-white"
                onClick={() => setSearchOpen(false)}
              >
                <X size={24} />
              </button>
            </form>
          )}

          {/* Auth Section */}
          {!user ? (
            <div className="flex gap-3">
              <Link 
                href="/sign-in" 
                className="hidden sm:block border border-gray-600 text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors"
              >
                Log In
              </Link>
              <Link 
                href="/sign-up" 
                className="bg-red-600 hover:bg-red-700 text-white rounded-md py-2 px-4 transition-colors text-sm sm:text-base"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="rounded-full size-10 bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                  {displayName ? (
                    <p className="text-xl font-bold text-white">
                      {displayName.slice(0, 1).toUpperCase()}
                    </p>
                  ) : (
                    <User size={20} className="text-white" />
                  )}
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 invisible group-hover:visible">
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={signOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="fixed top-20 left-0 w-64 bg-gray-900 z-40 lg:hidden border-r border-gray-800">
            <nav className="flex flex-col p-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg ${
                    pathname === link.href 
                      ? "bg-gray-800 text-white font-semibold" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <Link
                    href="/profile"
                    className="px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;

/* "use client";

import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const Header = () => {
  const [displayName, setDisplayName] = useState("");
  const { user, loading, getUserDisplayName } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchDisplayName = async () => {
        const name = await getUserDisplayName();
        setDisplayName(name);
      };
      fetchDisplayName();
    }
  }, [user, getUserDisplayName]);

  return (
    <header className="w-full top-0 z-50 h-20 bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg flex items-center justify-between px-4 sm:px-8 lg:px-12 border-b border-gray-800">
      <div className="flex-1">
        <Link href="/" className="text-3xl font-bold text-white hover:text-red-500 transition-colors">
          MoviesMate
        </Link>
      </div>

      <nav className="flex flex-1 justify-center gap-6 text-lg font-semibold max-[900px]:hidden">
        <Link href="/popular" className="text-gray-300 hover:text-white transition-colors">
          Popular
        </Link>
        <Link href="/trending" className="text-gray-300 hover:text-white transition-colors">
          Trending
        </Link>
        <Link href="/top-rated" className="text-gray-300 hover:text-white transition-colors">
          Top Rated
        </Link>
      </nav>

      <div className="flex flex-1 justify-end items-center gap-4">
        {!user ? (
          <div className="flex gap-3">
            <Link 
              href="/login" 
              className="border border-gray-600 text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors max-[640px]:hidden"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="bg-red-600 hover:bg-red-700 text-white rounded-md py-2 px-4 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="rounded-full size-10 bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
              <p className="text-xl font-bold text-white">
                {displayName?.slice(0, 1)?.toUpperCase() || "U"}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; */