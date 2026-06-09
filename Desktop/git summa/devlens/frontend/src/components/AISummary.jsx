import { Loader } from 'lucide-react';

export default function AISummary({ summary, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-slate-300">
        <Loader className="animate-spin mr-2" /> Analyzing repository...
      </div>
    );
  }

  if (!summary) {
    return <div className="text-slate-400 text-sm">No summary available</div>;
  }

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-5">
      <h3 className="font-semibold text-cyan-200 mb-3">AI Summary</h3>
      <p className="text-sm leading-7 text-slate-300">{summary}</p>
    </div>
  );
}
