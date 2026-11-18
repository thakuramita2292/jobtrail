const ACCENT_MAP = {
  Applied: 'border-t-indigo-600',
  Interviewing: 'border-t-amber-500',
  Interview: 'border-t-amber-500',
  Offers: 'border-t-emerald-500',
  Offer: 'border-t-emerald-500',
  Rejected: 'border-t-rose-500',
  Wishlist: 'border-t-slate-400',
  Screening: 'border-t-purple-500',
};

const StatCard = ({ label, count = 0, onClick }) => {
  const accentClass = ACCENT_MAP[label] || 'border-t-indigo-600';

  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-xl border border-slate-200 border-t-4 ${accentClass} shadow-xs flex flex-col justify-between h-28 transition ${
        onClick ? 'hover:shadow-md hover:-translate-y-0.5' : ''
      }`}
    >
      <span className="text-slate-500 text-sm font-medium">{label}</span>
      <span className="text-3xl font-bold text-slate-900">{count}</span>
    </div>
  );
};

export default StatCard;