import { ArrowRight, Users, Network } from "lucide-react";

export default function Home() {
  return (
    <div className="relative">
      {/* Background gradient + blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" />
      <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-16 text-center space-y-16">
        {/* Hero */}
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Employee Hierarchy
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Manage your team, explore organizational structures, and streamline
            workflows with our intuitive, modern platform.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/employees" className="btn-primary flex items-center gap-2">
              <Users className="w-5 h-5" /> View Employees
            </a>
            <a href="/org" className="btn-secondary flex items-center gap-2">
              <Network className="w-5 h-5" /> Organization Chart
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Employee Management
            </h3>
            <p className="text-slate-600 text-sm">
              View and manage your team members with advanced filtering and
              search capabilities.
            </p>
          </div>
          <div className="card hover:shadow-lg hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Network className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Organization Chart
            </h3>
            <p className="text-slate-600 text-sm">
              Explore the interactive org chart to understand reporting
              relationships and team structure.
            </p>
          </div>
        </div>

        {/* Quick Start */}
        <div className="card text-left">
          <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <div>
                <p className="font-medium text-slate-900">
                  Explore Employee Data
                </p>
                <p className="text-slate-600 text-sm">
                  Browse through employee profiles, search by name or role, and
                  view details.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <div>
                <p className="font-medium text-slate-900">
                  Visualize the Org Structure
                </p>
                <p className="text-slate-600 text-sm">
                  Navigate the org chart to understand reporting lines and team
                  structure.
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Footer links */}
        <footer className="flex gap-6 flex-wrap justify-center text-sm text-slate-500">
          <a href="https://nextjs.org/learn" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
            Documentation
          </a>
          <a href="#" className="hover:text-blue-600">Examples</a>
          <a href="#" className="hover:text-blue-600">Support</a>
        </footer>
      </div>
    </div>
  );
}
