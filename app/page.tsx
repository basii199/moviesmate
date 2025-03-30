import HeroSection from '@/components/Hero'
import PopularMovies from '@/components/movieSections/Popular'
import TopRatedMovies from '@/components/movieSections/TopRated'
import TrendingMovies from '@/components/movieSections/Trending'
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import React from 'react'

const Page = () => {
  return (
    <div className='w-full flex flex-col'>
      <Header />
      <div className="w-full h-20"></div>
      <HeroSection />
      <div id='movies' className='w-full flex flex-col'>
        <TrendingMovies />
        <PopularMovies />
        <TopRatedMovies />
      </div>
      <Footer />
    </div>
  )
}

export default Page