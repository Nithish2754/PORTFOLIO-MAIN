import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Rust', 'C++', 'Kotlin', 'C#'];

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [sort, setSort] = useState('stars');
  const [history, setHistory] = useState([]);

  const HISTORY_KEY = 'devlens_search_history';

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY) || '[]';
      setHistory(JSON.parse(raw));
    } catch (e) {
      setHistory([]);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch({ query, language, sort });
      // update history
      try {
        const raw = localStorage.getItem(HISTORY_KEY) || '[]';
        const list = JSON.parse(raw);
        const next = [query, ...list.filter((q) => q !== query)].slice(0, 5);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        setHistory(next);
      } catch (e) {
        // ignore
      }
    }
  };

  const removeHistoryItem = (item) => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY) || '[]';
      const list = JSON.parse(raw).filter((q) => q !== item);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
      setHistory(list);
    } catch (e) {}
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search repositories... (e.g. Traffic Management System)"
            className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          />
          <button
            type="submit"
            className="inline-flex h-14 items-center justify-center rounded-2xl bg-cyan-500 px-6 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            <Search size={18} /> Search
          </button>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="min-w-[180px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map((l) => (
              <option key={l} value={l} className="bg-slate-950 text-slate-100">
                {l}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="min-w-[180px] rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
          >
            <option value="stars">Sort by Stars</option>
            <option value="forks">Sort by Forks</option>
            <option value="updated">Recently Updated</option>
          </select>
        </div>
      </div>
      {history && history.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {history.map((h) => (
            <div key={h} className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-3 py-1 text-xs">
              <button onClick={() => { setQuery(h); onSearch({ query: h, language, sort }); }} className="text-slate-200">{h}</button>
              <button onClick={() => removeHistoryItem(h)} className="text-slate-400">✕</button>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
