import { useQuery } from '@tanstack/react-query';
import { analyzeRepo } from '../api/client';

export const useRepo = (owner, repo) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['repo', owner, repo],
    queryFn: () => analyzeRepo(owner, repo),
    enabled: !!owner && !!repo,
  });

  return {
    analysis: data?.data || null,
    isLoading,
    error: error?.message,
  };
};
