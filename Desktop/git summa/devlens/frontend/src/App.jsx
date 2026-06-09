import { useState } from 'react';
import TrendingPage from './pages/Trending';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchBar from './components/SearchBar';
import SearchResults from './pages/SearchResults';
import RepoChat from './components/RepoChat';
import { useSearch } from './hooks/useSearch';
import './index.css';

const queryClient = new QueryClient();

function AppContent() {
  const [searchParams, setSearchParams] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [view, setView] = useState('home');
  const { results, isLoading, total } = useSearch(
    searchParams?.query,
    searchParams?.language,
    searchParams?.sort
  );

  const handleSearch = (params) => {
    setSearchParams(params);
    setSelectedRepo(null);
  };

  const handleRepoSelect = (repo) => {
    setSelectedRepo(repo);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/15 border border-cyan-400/20 flex items-center justify-center shadow-lg shadow-cyan-500/10">
                <span className="text-cyan-300 font-black text-lg">D</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white">DevLens</h1>
                <p className="text-sm text-slate-400 mt-1">Dark interface for GitHub discovery and AI-driven repository analysis.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              {searchParams ? `${total || 0} repositories found` : 'Search, analyze, and explore repos'}
              <button
                onClick={() => setView('trending')}
                className="ml-3 inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800"
              >
                Trending
              </button>
              <span className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-cyan-200">Dark tone</span>
            </div>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {!searchParams ? (
              <div className="rounded-[32px] border border-slate-800 bg-slate-900/90 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.55)]">
                <div className="max-w-3xl">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80 mb-4">DevLens</p>
                  <h2 className="text-4xl md:text-5xl font-semibold text-white leading-tight">A darker, sharper view of GitHub repositories.</h2>
                  <p className="mt-6 text-slate-300 leading-8 text-lg">
                    Discover repositories with clean visuals, AI-powered insights, and a night-mode experience built for developers who explore code after hours.
                  </p>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {[
                    { title: 'Smart Search', desc: 'Find repositories by query, language, and popularity.' },
                    { title: 'AI Analysis', desc: 'Generate technology summaries and repo insights instantly.' },
                    { title: 'Repo Chat', desc: 'Ask questions about repository context and README details.' },
                    { title: 'Quick Recommendations', desc: 'Surface similar projects that match your interests.' },
                  ].map((item) => (
                    <div key={item.title} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : view === 'trending' ? (
              <TrendingPage onRepoSelect={handleRepoSelect} onBack={() => setView('home')} />
            ) : (
              <SearchResults
                results={results}
                isLoading={isLoading}
                onRepoSelect={handleRepoSelect}
              />
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="space-y-6">
              <div className="rounded-[28px] border border-slate-800 bg-slate-900/90 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.5)]">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80 mb-3">About DevLens</p>
                <h3 className="text-2xl font-semibold text-white">Built for modern repo discovery</h3>
                <p className="mt-4 text-slate-300 leading-7 text-sm">
                  DevLens brings GitHub search, AI insight, and repository intelligence together in a dark interface that feels polished, focused, and developer-friendly.
                </p>
                <div className="mt-6 space-y-3 text-sm text-slate-400">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    <span>Search repositories with advanced filters.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    <span>Analyze tech stacks and get AI summaries.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    <span>Chat with repo context for faster decisions.</span>
                  </div>
                </div>
              </div>

              {selectedRepo && (
                <div className="rounded-[28px] border border-slate-800 bg-slate-900/90 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.5)]">
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Selected repo</p>
                    <h3 className="text-xl font-semibold text-white mt-2">{selectedRepo.name}</h3>
                    <p className="text-sm text-slate-400 mt-2">{selectedRepo.description}</p>
                  </div>
                  <RepoChat repo={selectedRepo} readme="" />
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
