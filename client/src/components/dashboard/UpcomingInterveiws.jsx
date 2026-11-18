import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const UpcomingInterviews = ({
  title = 'Upcoming interviews',
  interviews = [],
  limit = 4,
  emptyMessage = 'No upcoming interviews scheduled.',
}) => {
  const visibleInterviews = interviews.slice(0, limit);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          {interviews.length}
        </span>
      </div>

      <div className="space-y-4">
        {visibleInterviews.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">{emptyMessage}</p>
        ) : (
          visibleInterviews.map((iv, index) => (
            <div
              key={iv.id || index}
              className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-3 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="min-w-0">
                  {iv.appId ? (
                    <Link
                      to={`/applications/${iv.appId}`}
                      className="font-semibold text-sm text-slate-900 hover:text-indigo-600 truncate block"
                    >
                      {iv.company}
                    </Link>
                  ) : (
                    <p className="font-semibold text-sm text-slate-900 truncate">{iv.company}</p>
                  )}
                  <p className="text-xs text-slate-500 truncate">{iv.type}</p>
                </div>
              </div>

              <span className="text-xs font-medium px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md shrink-0">
                {iv.scheduledAt}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingInterviews;