import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchStats, fetchApplications } from '../api/application';
import { setFilters } from '../store/ApplicationSlice';

import StatCard from '../components/common/Statcard';
import WeeklyChart from '../components/dashboard/WeeklyChart';
import UpcomingInterviews from '../components/dashboard/UpcomingInterveiws';
import RecentApplications from '../components/dashboard/RecentApplication';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchStats(), fetchApplications()])
      .then(([statsData, appsData]) => {
        setStats(statsData);
        setApplications(appsData);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500">Loading dashboard...</div>;
  }

  const upcomingInterviews = applications.flatMap((app) =>
    (app.interviews || []).map((iv) => ({
      ...iv,
      company: app.company,
      appId: app.id,
    }))
  );

  const dynamicCounts = {
    Applied: applications.filter((a) => a.status === 'Applied').length || stats?.counts?.Applied || 0,
    Interview: applications.filter((a) => a.status === 'Interview').length || stats?.counts?.Interviewing || 0,
    Offer: applications.filter((a) => a.status === 'Offer').length || stats?.counts?.Offers || 0,
    Rejected: applications.filter((a) => a.status === 'Rejected').length || stats?.counts?.Rejected || 0,
  };

  const handleCardClick = (statusKey) => {
    dispatch(setFilters({ status: statusKey, page: 1 }));
    navigate('/applications');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(dynamicCounts).map(([status, count]) => (
          <StatCard
            key={status}
            label={status}
            count={count}
            onClick={() => handleCardClick(status)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyChart
            title="Applications per week"
            badgeText="Last 8 Weeks"
            data={stats?.weekly || []}
          />
        </div>
        <div>
          <UpcomingInterviews
            title="Upcoming interviews"
            interviews={upcomingInterviews}
            limit={4}
          />
        </div>
      </div>

      <RecentApplications
        title="Recent applications"
        applications={applications}
        limit={4}
        viewAllLink="/applications"
      />
    </div>
  );
};

export default Dashboard;