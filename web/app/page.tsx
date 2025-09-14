import React from 'react';
import { Users, BarChart3, UserPlus, Building2 } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
        {icon}
      </div>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Management Dashboard</h1>
          <p className="text-gray-600">Manage your organization's employee hierarchy and data</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={<Users className="h-6 w-6 text-blue-600" />}
            color="border-l-blue-500"
          />
          <StatCard
            title="Total Managers"
            value={stats.totalManagers}
            icon={<UserPlus className="h-6 w-6 text-green-600" />}
            color="border-l-green-500"
          />
          <StatCard
            title="Departments"
            value={stats.departments}
            icon={<Building2 className="h-6 w-6 text-purple-600" />}
            color="border-l-purple-500"
          />
          <StatCard
            title="Avg Salary"
            value={`$${stats.avgSalary.toLocaleString()}`}
            icon={<BarChart3 className="h-6 w-6 text-orange-600" />}
            color="border-l-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add New Employee
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <Users className="h-4 w-4" />
                  View All Employees
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  View Org Chart
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.employee}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Welcome to EPI-USE Africa Employee Management</h2>
          <p className="text-blue-100 mb-4">
            Efficiently manage your organization's employee hierarchy with our comprehensive cloud-based solution. 
            Create, update, and visualize your team structure with ease.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">✓ Employee CRUD Operations</span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">✓ Hierarchy Visualization</span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">✓ Gravatar Integration</span>
            <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">✓ Advanced Filtering</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;