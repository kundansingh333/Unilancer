const StatCard = ({ title, value, color }) => (
  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
    <p className="text-xs text-slate-400">{title}</p>
    <p className={`text-xl font-bold ${color}`}>{value}</p>
  </div>
);

export default StatCard;
