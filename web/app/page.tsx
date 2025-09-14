import React from 'react';
import { Users, BarChart3, UserPlus, Building2 } from 'lucide-react';
import Layout from './layout';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => (
  <div className={`stat-card ${colorClass}`}>
    <div className="stat-info">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
    <div className="stat-icon">
      {icon}
    </div>
  </div>
);

const Home: React.FC = () => {
  // Mock data - in real app, this would come from your API
  const stats = {
    totalEmployees: 127,
    totalManagers: 15,
    departments: 8,
    avgSalary: 65000
  };

  const recentActivities = [
    { action: 'New employee added', employee: 'John Smith', time: '2 hours ago' },
    { action: 'Employee updated', employee: 'Sarah Johnson', time: '4 hours ago' },
    { action: 'Manager assigned', employee: 'Mike Davis', time: '6 hours ago' },
    { action: 'Employee deleted', employee: 'Lisa Brown', time: '1 day ago' },
  ];

  return (
    <Layout currentPage="home">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-8">
          <h1 className="card-title">Employee Management Dashboard</h1>
          <p className="card-description">Manage your organization's employee hierarchy and data</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={<Users size={24} />}
            colorClass="blue"
          />
          <StatCard
            title="Total Managers"
            value={stats.totalManagers}
            icon={<UserPlus size={24} />}
            colorClass="green"
          />
          <StatCard
            title="Departments"
            value={stats.departments}
            icon={<Building2 size={24} />}
            colorClass="purple"
          />
          <StatCard
            title="Avg Salary"
            value={`$${stats.avgSalary.toLocaleString()}`}
            icon={<BarChart3 size={24} />}
            colorClass="orange"
          />
        </div>

        <div className="flex flex-col gap-6" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="flex flex-col gap-3">
              <button className="btn btn-primary">
                <UserPlus size={16} />
                Add New Employee
              </button>
              <button className="btn btn-secondary">
                <Users size={16} />
                View All Employees
              </button>
              <button className="btn btn-secondary">
                <BarChart3 size={16} />
                View Org Chart
              </button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Activities</h3>
            </div>
            <div className="flex flex-col gap-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex justify-between items-center" style={{ paddingBottom: '1rem', borderBottom: index < recentActivities.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                  <div>
                    <p style={{ fontWeight: '500', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{activity.action}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{activity.employee}</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="card mt-8" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', color: 'white' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Welcome to EPI-USE Africa Employee Management</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '1rem' }}>
            Efficiently manage your organization's employee hierarchy with our comprehensive cloud-based solution. 
            Create, update, and visualize your team structure with ease.
          </p>
          <div className="flex gap-4" style={{ flexWrap: 'wrap', fontSize: '0.875rem' }}>
            <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>✓ Employee CRUD Operations</span>
            <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>✓ Hierarchy Visualization</span>
            <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>✓ Gravatar Integration</span>
            <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>✓ Advanced Filtering</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;