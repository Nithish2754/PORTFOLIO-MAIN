import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import RepoCard from '../components/RepoCard';
import { getTrending } from '../api/client';

export default function TrendingPage({ onRepoSelect, onBack }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const r = await getTrending();
        if (mounted) setResults(r.data?.results || []);
      } catch (e) {
        console.error('Trending load error', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Trending This Week</h2>
        <button onClick={onBack} className="text-sm text-slate-300 underline">Back</button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-slate-400"><Loader className="animate-spin" /> Loading trending repositories...</div>
      ) : (
        <div className="space-y-6">
          {results.map((repo) => (
            <RepoCard key={repo.id} repo={{ ...repo, owner: repo.owner, url: repo.url, rank_score: repo.stars }} onAnalyze={() => {}} onSelect={onRepoSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
