import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative font-sans grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        
        {/* Header with navigation */}
        <header className="w-full max-w-6xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-slate-800">Company Portal</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/employees" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Employees</a>
            <a href="/org" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">Org Chart</a>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
              Sign In
            </button>
          </nav>
        </header>

        {/* Main content */}
        <main className="flex flex-col gap-12 row-start-2 items-center text-center max-w-4xl">
          
          {/* Hero section */}
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <Image
                  className="dark:invert drop-shadow-lg"
                  src="/next.svg"
                  alt="Next.js logo"
                  width={240}
                  height={50}
                  priority
                />
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight">
              Welcome to Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Company Portal
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
              Manage your team, explore organizational structures, and streamline your workflow with our modern, intuitive platform.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Employee Management</h3>
              <p className="text-slate-600 text-sm">View and manage your team members with advanced filtering and search capabilities.</p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM9 7h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Organization Chart</h3>
              <p className="text-slate-600 text-sm">Interactive org chart with drag-and-drop functionality and hierarchical visualization.</p>
            </div>
          </div>

          {/* Quick start guide */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-lg w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Start</h2>
            <ol className="space-y-4 text-left">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <span className="font-medium text-slate-900">Explore Employee Data</span>
                  <p className="text-slate-600 text-sm mt-1">Browse through employee profiles, search by name or role, and view detailed information.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <span className="font-medium text-slate-900">Visualize Organization Structure</span>
                  <p className="text-slate-600 text-sm mt-1">Navigate the interactive org chart to understand reporting relationships and team structure.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <a
              className="group relative rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-blue-500/25 font-semibold text-base h-14 px-8 hover:scale-105"
              href="/employees"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              View Employees
            </a>
            <a
              className="group rounded-2xl border-2 border-slate-300 bg-white/70 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-3 hover:bg-white hover:border-slate-400 hover:shadow-lg font-semibold text-slate-700 text-base h-14 px-8 hover:scale-105"
              href="/org"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM9 7h6" />
              </svg>
              Organization Chart
            </a>
          </div>
        </main>

        {/* Footer */}
        <footer className="row-start-3 flex gap-8 flex-wrap items-center justify-center text-sm">
          <a
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors hover:underline hover:underline-offset-4"
            href="https://nextjs.org/learn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Documentation
          </a>
          <a
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors hover:underline hover:underline-offset-4"
            href="#"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Examples
          </a>
          <a
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors hover:underline hover:underline-offset-4"
            href="#"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9V3" />
            </svg>
            Support
          </a>
        </footer>
      </div>
    </div>
  );
}