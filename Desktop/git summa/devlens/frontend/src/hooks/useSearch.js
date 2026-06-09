import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchRepos } from '../api/client';

export const useSearch = (query, language = '', sort = 'stars') => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', query, language, sort, page],
    queryFn: () => searchRepos(query, language, sort, page),
    enabled: !!query,
  });

  return {
    results: data?.data?.results || [],
    total: data?.data?.total || 0,
    isLoading,
    error: error?.message,
    page,
    setPage,
  };
};
