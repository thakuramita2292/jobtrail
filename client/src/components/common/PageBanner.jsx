import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const PageBanner = ({ title, subtitle, actionLabel, actionTo }) => {
  return (
    <div className="bg-indigo-950 text-white p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 sideMarketingPanel-r">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-indigo-200 text-sm mt-1">{subtitle}</p>}
      </div>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-500 transition flex items-center gap-2 w-fit shadow-sm"
        >
          <Plus size={18} /> {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default PageBanner;