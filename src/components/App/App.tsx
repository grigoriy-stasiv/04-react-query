import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import { SearchBar } from '../SearchBar/SearchBar';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Loader } from '../Loader/Loader';
import { MovieGrid } from '../MovieGrid/MovieGrid';
import { MovieModal } from '../MovieModal/MovieModal';
import css from './App.module.css';

import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as
  ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

export default function App() {
  
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: async () => {
      const res = await fetchMovies(query, page);
      
      if (res.results.length === 0 && query !== '') {
        toast.error('No movies found for your request.');
      }
      return res;
    },
    enabled: query !== '', 
  });

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1); 
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setPage(selectedItem.selected + 1);
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />

      {isError && <ErrorMessage />}

      {isLoading && <Loader />}

      {data && data.results.length > 0 && !isLoading && (
        <MovieGrid movies={data.results} onSelect={setSelectedMovie} />
      )}

      {}
      {data && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={handlePageClick}
          forcePage={page - 1} 
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
