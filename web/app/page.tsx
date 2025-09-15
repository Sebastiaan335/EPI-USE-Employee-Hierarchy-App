"use client";

import React, { useEffect, useState } from "react";
import { Users, BarChart3, UserPlus, Building2 } from "lucide-react";
import Layout from "../components/layout";

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
    <div className="stat-icon">{icon}</div>
  </div>
);

const Home: React.FC = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalManagers: 0,
    departments: 1,
    avgSalary: 0,
  });

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((data) => {
        const totalEmployees = data.length;
        const totalManagers = data.filter((e: any) =>
          data.some((r: any) => r.managerid === e.id)
        ).length;
        const avgSalary =
          totalEmployees > 0
            ? data.reduce((sum: number, e: any) => {
                const sal = Number(e.salary);
                return sum + (isNaN(sal) ? 0 : sal);
              }, 0) / totalEmployees
            : 0;
        
        setStats({ totalEmployees, totalManagers, departments: 1, avgSalary });
      });
  }, []);

  return (
    <Layout currentPage="home">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-8">
          <h1 className="card-title">Employee Management Dashboard</h1>
          <p className="card-description">
            Manage your organization's employee hierarchy and data
          </p>
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
            value={new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: "ZAR",
            }).format(stats.avgSalary)}
            icon={<BarChart3 size={24} />}
            colorClass="orange"
          />
        </div>

        {/* Quick Actions */}
        <div
          className="flex flex-col gap-6"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "1.5rem",
          }}
        >
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="flex flex-col gap-3">
              <a href="/employees" className="btn btn-primary">
                <UserPlus size={16} />
                Add New Employee
              </a>
              <a href="/employees" className="btn btn-secondary">
                <Users size={16} />
                View All Employees
              </a>
              <a href="/org" className="btn btn-secondary">
                <BarChart3 size={16} />
                View Org Chart
              </a>
            </div>
          </div>

          {/* Placeholder Recent Activities (optional enhancement) */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Activities</h3>
            </div>
            <p className="card-description">
              Activity tracking can be added later if required.
            </p>
          </div>
        </div>

        {/* Welcome Message */}
        <div
          className="card mt-8"
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
            color: "white",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>
            Welcome to EPI-USE Africa Employee Management
          </h2>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "1rem",
            }}
          >
            Efficiently manage your organization's employee hierarchy with our
            comprehensive cloud-based solution. Create, update, and visualize
            your team structure with ease.
          </p>
          <div
            className="flex gap-4"
            style={{ flexWrap: "wrap", fontSize: "0.875rem" }}
          >
            <span className="badge" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}>
              ✓ Employee CRUD Operations
            </span>
            <span className="badge" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}>
              ✓ Hierarchy Visualization
            </span>
            <span className="badge" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}>
              ✓ Gravatar Integration
            </span>
            <span className="badge" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}>
              ✓ Advanced Filtering
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
