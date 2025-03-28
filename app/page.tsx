import HeroSection from '@/components/Hero'
import PopularMovies from '@/components/movieSections/Popular'
import TopRatedMovies from '@/components/movieSections/TopRated'
import TrendingMovies from '@/components/movieSections/Trending'
import React from 'react'

const Page = () => {
  return (
    <div className='w-full flex flex-col'>
      <HeroSection />
      <TrendingMovies />
      <PopularMovies />
      <TopRatedMovies />
    </div>
  )
}

export default Page