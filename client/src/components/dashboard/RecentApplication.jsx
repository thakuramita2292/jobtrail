
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import StatusBadge from '../StatusBadge';
import CompanyAvatar from '../common/campanyAvatar';

const RecentApplications = ({
  title = 'Recent applications',
  applications = [],
  limit = 4,
  viewAllLink = '/applications',
}) => {
  const displayedApps = applications.slice(0, limit);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-sm text-indigo-600 font-semibold hover:underline flex items-center gap-1"
          >
            View all <ArrowRight size={15} />
          </Link>
        )}
      </div>

      {displayedApps.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-400">
          No applications added yet. Click "Add application" to get started!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="py-3.5 px-6">Company</th>
                <th className="py-3.5 px-6">Position</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900">
                    <Link
                      to={`/applications/${app.id}`}
                      className="flex items-center gap-3 hover:text-indigo-600"
                    >
                      <CompanyAvatar company={app.company} size="sm" />
                      <span>{app.company}</span>
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{app.role}</td>
                  <td className="py-4 px-6">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="py-4 px-6 text-slate-500">{app.appliedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentApplications;