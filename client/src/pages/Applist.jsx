import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadApplications, setFilters, removeApplication } from '../store/ApplicationSlice';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { Search, Trash2, Edit3 } from 'lucide-react';

const ALL_STATUSES = [
  'Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Withdrawn'
];

const AppList = () => {
  const dispatch = useDispatch();
  const { list, status, error, filters } = useSelector((state) => state.applications);
  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    dispatch(loadApplications());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchInput, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, dispatch]);

  const filteredList = list
    .filter((app) => {
      const matchesSearch =
        app.company.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.role.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status ? app.status === filters.status : true;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (filters.sort === 'company_asc') return a.company.localeCompare(b.company);
      if (filters.sort === 'appliedDate_asc') return new Date(a.appliedDate) - new Date(b.appliedDate);
      return new Date(b.appliedDate) - new Date(a.appliedDate);
    });

  const total = filteredList.length;
  const totalPages = Math.ceil(total / filters.limit) || 1;
  const startIndex = (filters.page - 1) * filters.limit;
  const paginatedList = filteredList.slice(startIndex, startIndex + filters.limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-4 py-2 bg-white text-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => dispatch(setFilters({ status: e.target.value, page: 1 }))}
          className="border rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700"
        >
          <option value="">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => dispatch(setFilters({ sort: e.target.value }))}
          className="border rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700"
        >
          <option value="appliedDate_desc">Sort by: Newest</option>
          <option value="appliedDate_asc">Sort by: Oldest</option>
          <option value="company_asc">Sort by: Company (A-Z)</option>
        </select>
      </div>

      {status === 'loading' && <div className="p-8 text-center text-gray-500 bg-white rounded-xl border">Loading applications...</div>}
      {status === 'failed' && <div className="p-6 text-rose-600 bg-rose-50 rounded-xl border border-rose-200">{error}</div>}

      {status === 'succeeded' && (
        <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
          {paginatedList.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No applications match your current filters.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Company</th>
                  <th className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Role</th>
                  <th className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Location</th>
                  <th className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Applied date</th>
                  <th className="py-3.5 px-6 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {paginatedList.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 font-medium text-gray-900">
                      <Link to={`/applications/${app.id}`} className="flex items-center gap-3 hover:text-primary">
                        <span className="w-8 h-8 rounded-lg bg-indigo-50 text-primary font-bold text-xs flex items-center justify-center border border-indigo-100">
                          {app.company.slice(0, 2).toUpperCase()}
                        </span>
                        {app.company}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{app.role}</td>
                    <td className="py-4 px-6 text-gray-500">{app.location}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="py-4 px-6 text-gray-500">{app.appliedDate}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link to={`/applications/${app.id}/edit`} className="inline-block p-1.5 text-gray-500 hover:text-primary rounded">
                        <Edit3 size={16} />
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${app.company} application?`)) {
                            dispatch(removeApplication(app.id));
                          }
                        }}
                        className="p-1.5 text-gray-500 hover:text-rose-600 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {total === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + filters.limit, total)} of {total}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => dispatch(setFilters({ page: pageNum }))}
                  className={`px-3 py-1 rounded border text-xs font-medium ${
                    filters.page === pageNum ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppList;