const STATUS_STYLES = {
  Wishlist: 'bg-slate-100 text-slate-700 border-slate-200',
  Applied: 'bg-blue-50 text-blue-700 border-blue-200',
  Screening: 'bg-purple-50 text-purple-700 border-purple-200',
  Interview: 'bg-amber-50 text-amber-700 border-amber-200',
  Offer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Accepted: 'bg-green-100 text-green-800 border-green-300',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  Withdrawn: 'bg-gray-100 text-gray-500 border-gray-300',
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Applied;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${style}`}>
      {status}
    </span>
  );
};

export default StatusBadge;