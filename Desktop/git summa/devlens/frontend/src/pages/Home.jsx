import { Home } from 'lucide-react';
import SearchBar from '../components/SearchBar';

export default function Home({ onSearch }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12 max-w-4xl">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Home size={40} className="text-cyan-300" />
          <h1 className="text-5xl font-bold text-white">DevLens</h1>
        </div>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Explore GitHub repositories with a sleek dark UI, AI summaries, and intelligent recommendations for developers.
        </p>
      </div>

      <div className="w-full max-w-4xl rounded-[32px] border border-slate-800 bg-slate-900/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.55)]">
        <SearchBar onSearch={onSearch} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
        {[
          {
            icon: '🔍',
            title: 'Smart Search',
            desc: 'Filter by language, sort by trends'
          },
          {
            icon: '✨',
            title: 'AI Analysis',
            desc: 'Auto-detect tech stack & summaries'
          },
          {
            icon: '🎯',
            title: 'Recommendations',
            desc: 'Find similar & matching projects'
          }
        ].map((feature, i) => (
          <div key={i} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 text-slate-100 shadow-xl shadow-slate-950/40">
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="font-semibold text-lg mb-2 text-white">{feature.title}</h3>
            <p className="text-sm text-slate-400">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
