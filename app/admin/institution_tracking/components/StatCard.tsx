interface Props {
  title: string;
  value: string;
  change: string;
  color: string;
}

export default function StatCard({ title, value, change, color }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-500">{title}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>
          {change}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}
