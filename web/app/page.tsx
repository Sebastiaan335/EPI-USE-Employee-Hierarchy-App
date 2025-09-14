// ========================
// Home Page
// ========================

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse [animation-delay:800ms]"></div>
      </div>

      <section className="max-w-6xl mx-auto grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-[70vh] gap-12">
        <header className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
            <span className="text-xl font-bold text-slate-800">Company Portal</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/employees" className="nav-link">Employees</Link>
            <Link href="/org" className="nav-link">Org Chart</Link>
            <button className="btn-secondary">Sign In</button>
          </nav>
        </header>

        <main className="flex flex-col gap-10 items-center text-center max-w-4xl">
          <div className="space-y-6">
            <div className="flex justify-center mb-3">
              <div className="relative">
                <Image className="dark:invert drop-shadow" src="/next.svg" alt="Next.js logo" width={200} height={46} priority />
                <div className="absolute -inset-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl" />
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight">
              Welcome to Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Company Portal</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
              Manage your team, explore organizational structures, and streamline your workflow with our modern, intuitive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <div className="card hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Employee Management</h3>
              <p className="text-slate-600 text-sm">View and manage your team members with advanced filtering and search capabilities.</p>
            </div>
            <div className="card hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM9 7h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">Organization Chart</h3>
              <p className="text-slate-600 text-sm">Interactive org chart with hierarchical visualization and inline editing.</p>
            </div>
          </div>

          <div className="card w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Quick Start</h2>
            <ol className="space-y-3 text-left">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <span className="font-medium text-slate-900">Explore Employee Data</span>
                  <p className="text-slate-600 text-sm mt-1">Browse through employee profiles, search by name or role, and view detailed information.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <span className="font-medium text-slate-900">Visualize Organization Structure</span>
                  <p className="text-slate-600 text-sm mt-1">Navigate the interactive org chart to understand reporting relationships and team structure.</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <Link className="btn-primary h-12 px-6" href="/employees">View Employees</Link>
            <Link className="btn-secondary h-12 px-6" href="/org">Organization Chart</Link>
          </div>
        </main>
      </section>
    </div>
  );
}