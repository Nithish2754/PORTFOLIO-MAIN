export default function TechBadges({ technologies = [] }) {
  if (!technologies || technologies.length === 0) {
    return <div className="text-sm text-slate-400">No technologies detected</div>;
  }

  const colors = [
    'bg-slate-800 text-slate-100',
    'bg-cyan-900 text-cyan-200',
    'bg-violet-900 text-violet-200',
    'bg-emerald-900 text-emerald-200',
    'bg-amber-900 text-amber-200',
    'bg-fuchsia-900 text-fuchsia-200',
    'bg-rose-900 text-rose-200',
    'bg-sky-900 text-sky-200',
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech, index) => (
        <span
          key={tech}
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${colors[index % colors.length]}`}
        >
          {tech}
        </span>
      ))}
    </div>
  );
}
