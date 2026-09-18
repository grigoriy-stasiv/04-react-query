import axios from 'axios';
import type { Movie } from '../types/movie';

export interface TMDBResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: 'Bearer ' + import.meta.env.VITE_TMDB_TOKEN,
  },
});

export const fetchMovies = async (query: string, page: number): Promise<TMDBResponse> => {
  const response = await instance.get<TMDBResponse>('/search/movie', {
    params: {
      query,
      include_adult: false,
      language: 'en-US',
      page: page,
    },
  });
  return response.data;
};