import { Star, GitFork, ExternalLink, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

function BookmarkButton({ repo }) {
  const key = 'devlens_favorites';
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key) || '[]';
      const list = JSON.parse(raw);
      setSaved(list.some((r) => r.full_name === (repo.full_name || `${repo.owner}/${repo.name}`)));
    } catch (e) {
      setSaved(false);
    }
  }, [repo]);

  const toggle = (e) => {
    e.stopPropagation();
    try {
      const raw = localStorage.getItem(key) || '[]';
      const list = JSON.parse(raw);
      const id = repo.full_name || `${repo.owner}/${repo.name}`;
      if (list.some((r) => r.full_name === id)) {
        const next = list.filter((r) => r.full_name !== id);
        localStorage.setItem(key, JSON.stringify(next));
        setSaved(false);
      } else {
        const next = [...list, { id: repo.id, full_name: id, name: repo.name, owner: repo.owner, url: repo.url }];
        localStorage.setItem(key, JSON.stringify(next));
        setSaved(true);
      }
    } catch (e) {
      console.error('Bookmark toggle error', e);
    }
  };

  return (
    <button onClick={toggle} className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-100">
      <Star size={14} className={saved ? 'text-yellow-400' : 'text-slate-400'} />
    </button>
  );
}

export default function RepoCard({ repo, onAnalyze, onSelect, isAnalyzing = false }) {
  return (
    <div
      className="group cursor-pointer rounded-[28px] border border-slate-800 bg-slate-900/95 p-6 shadow-[0_20px_45px_rgba(15,23,42,0.35)] transition-all hover:-translate-y-0.5 hover:border-cyan-500/30"
      onClick={() => onSelect?.(repo)}
    >
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white transition-colors group-hover:text-cyan-300">{repo.name}</h3>
          <p className="text-xs text-slate-400 mt-1">by {repo.owner}</p>
        </div>
        <span className="whitespace-nowrap rounded-full bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
          Score: {repo.rank_score}
        </span>
      </div>

            <div className="ml-4">
              <BookmarkButton repo={repo} />
            </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {repo.topics?.slice(0, 3).map((t) => (
          <span key={t} className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
            {t}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1 text-slate-300">
            <Star size={14} className="text-cyan-400" />
            {repo.stars?.toLocaleString()}
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <GitFork size={14} className="text-cyan-400" />
            {repo.forks?.toLocaleString()}
          </span>
          {repo.language && <span className="text-cyan-300 font-medium">{repo.language}</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAnalyze?.(repo);
            }}
            disabled={isAnalyzing}
            className="inline-flex items-center gap-1 rounded-2xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
          >
            <Zap size={14} /> {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-2xl bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 transition hover:bg-slate-700"
          >
            <ExternalLink size={14} /> View
          </a>
        </div>
      </div>
    </div>
  );
}
