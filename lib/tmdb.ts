const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const fetchMovies = async (endpoint: string, queryParams = "") => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&language=en-US${queryParams}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching movies:", error);
    return null;
  }
};

export const fetchMoviesFull = async (
  endpoint: "popular" | "top_rated" | "trending",
  page: number = 1
) => {
  try {
    const path = endpoint === "trending" 
      ? "/trending/movie/day" 
      : `/movie/${endpoint}`;
    
    const response = await fetch(
      `${TMDB_BASE_URL}${path}?api_key=${TMDB_API_KEY}&language=en-US&page=${page}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    
    const data = await response.json();
    
    if (data.total_pages > 500) {
      data.total_pages = 500;
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} movies:`, error);
    return null;
  }
};

export const getPopularMovies = () => fetchMovies("movie/popular");
export const getTrendingMovies = () => fetchMovies("trending/movie/day");
export const getTopRatedMovies = () => fetchMovies("movie/top_rated");

export const searchMovies = (query: string, page: number = 1) => 
  fetchMovies("search/movie", `&query=${query}&page=${page}`);
export const getMovieDetails = (id: string) => fetchMovies(`movie/${id}`);
export const getMovieTrailer = (id: string) => fetchMovies(`movie/${id}/videos`);
