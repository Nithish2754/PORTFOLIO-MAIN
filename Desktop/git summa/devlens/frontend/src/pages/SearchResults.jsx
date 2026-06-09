import { useState } from 'react';
import { Loader, ChevronDown } from 'lucide-react';
import RepoCard from '../components/RepoCard';
import AISummary from '../components/AISummary';
import TechBadges from '../components/TechBadges';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { analyzeRepo } from '../api/client';

export default function SearchResults({ results, isLoading, onRepoSelect }) {
  const [expandedRepo, setExpandedRepo] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(null);
  const [analysisData, setAnalysisData] = useState({});
  const [analysisError, setAnalysisError] = useState({});

  const handleAnalyze = async (repo) => {
    if (analysisLoading === repo.full_name) return;

    setAnalysisLoading(repo.full_name);
    setAnalysisError((prev) => ({ ...prev, [repo.full_name]: null }));

    try {
      const response = await analyzeRepo(repo.owner, repo.name, repo.description);
      const payload = response.data || {};

      if (payload.error) {
        setAnalysisError((prev) => ({ ...prev, [repo.full_name]: payload.error }));
      }

      setAnalysisData((prev) => ({
        ...prev,
        [repo.full_name]: payload,
      }));
      setExpandedRepo(repo.id);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisError((prev) => ({
        ...prev,
        [repo.full_name]: error.message || 'Analysis failed',
      }));
    } finally {
      setAnalysisLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-300">
        <Loader className="animate-spin mb-3" size={28} />
        <span className="text-lg">Searching repositories...</span>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return <div className="rounded-[28px] border border-slate-800 bg-slate-900/90 p-10 text-center text-slate-400">No repositories found. Try another search!</div>;
  }

  return (
    <div className="space-y-6">
      {results.map((repo) => (
        <div key={repo.id} className="space-y-3">
          <RepoCard
            repo={repo}
            onAnalyze={handleAnalyze}
            onSelect={onRepoSelect}
            isAnalyzing={analysisLoading === repo.full_name}
          />

          {analysisError[repo.full_name] && (
            <div className="rounded-3xl border border-rose-500/30 bg-rose-950/90 p-4 text-sm text-rose-200">
              <strong>Error:</strong> {analysisError[repo.full_name]}
            </div>
          )}

          {expandedRepo === repo.id && analysisData[repo.full_name] && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 shadow-[0_20px_50px_rgba(15,23,42,0.4)]">
              <TechBadges technologies={analysisData[repo.full_name]?.technologies || []} />
              <AISummary summary={analysisData[repo.full_name]?.ai_summary} isLoading={analysisLoading === repo.full_name} />
              <div className="text-sm text-slate-400">
                <strong className="text-slate-200">Languages:</strong> {Object.keys(analysisData[repo.full_name]?.languages || {}).join(', ') || 'Unknown'}
              </div>

              {analysisData[repo.full_name]?.languages && Object.keys(analysisData[repo.full_name].languages).length > 0 && (
                <div style={{ height: 140 }} className="mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(analysisData[repo.full_name].languages).map(([k,v])=>({ name:k, value:v }))}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={60}
                        innerRadius={24}
                        paddingAngle={2}
                      >
                        {Object.keys(analysisData[repo.full_name].languages).map((_, idx) => (
                          <Cell key={idx} fill={["#06b6d4", "#7c3aed", "#f97316", "#10b981", "#60a5fa"][idx % 5]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${Math.round(value)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Quick setup commands */}
              {(analysisData[repo.full_name]?.has_requirements || analysisData[repo.full_name]?.has_package_json) && (
                <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                  <div className="text-sm text-slate-300 font-semibold mb-2">Quick Setup</div>
                  {analysisData[repo.full_name]?.has_requirements && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs text-slate-200">Python</div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-slate-300">pip install -r requirements.txt</div>
                        <button
                          onClick={() => navigator.clipboard.writeText('pip install -r requirements.txt')}
                          className="text-xs bg-slate-800 px-2 py-1 rounded-md text-slate-200"
                        >Copy</button>
                      </div>
                    </div>
                  )}
                  {analysisData[repo.full_name]?.has_package_json && (
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-200">Node</div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-slate-300">npm install</div>
                        <button
                          onClick={() => navigator.clipboard.writeText('npm install')}
                          className="text-xs bg-slate-800 px-2 py-1 rounded-md text-slate-200"
                        >Copy</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {analysisData[repo.full_name] && (
            <button
              onClick={() => setExpandedRepo(expandedRepo === repo.id ? null : repo.id)}
              className="inline-flex items-center gap-1 text-sm font-medium text-cyan-300 transition hover:text-cyan-100"
            >
              <ChevronDown size={16} className={`transition ${expandedRepo === repo.id ? 'rotate-180' : ''}`} />
              {expandedRepo === repo.id ? 'Hide Analysis' : 'Show Analysis'}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
