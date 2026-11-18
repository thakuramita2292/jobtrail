const WeeklyChart = ({
  title = 'Applications per week',
  badgeText = 'Last 8 Weeks',
  data = [],
}) => {
  const maxCount = Math.max(...data.map((d) => d.count), 10);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {badgeText && (
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            {badgeText}
          </span>
        )}
      </div>

      {data.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-sm text-slate-400">
          No weekly activity data available yet.
        </div>
      ) : (
        <div className="flex items-end gap-4 h-44 pt-4 px-2 border-b border-slate-100">
          {data.map((item) => {
            const heightPercent = Math.round((item.count / maxCount) * 100);
            return (
              <div
                key={item.week}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
              >
                <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                  {item.count}
                </span>
                <div
                  style={{ height: `${Math.max(heightPercent, 6)}%` }}
                  className="w-full max-w-[36px] bg-indigo-600 group-hover:bg-indigo-500 rounded-t-md transition-all"
                  title={`Week ${item.week}: ${item.count} applications`}
                />
                <span className="text-xs font-medium text-slate-400">W{item.week}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WeeklyChart;
