import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Employee Hierarchy App",
  description: "Manage and visualize employees in the organisation",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-800">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Brand */}
            <Link
              href="/"
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Employee Hierarchy
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <Link href="/employees" className="hover:text-blue-600">
                Employees
              </Link>
              <Link href="/org" className="hover:text-blue-600">
                Org Chart
              </Link>
            </nav>

            {/* Mobile Menu Button (optional) */}
            <button className="md:hidden p-2 rounded-lg hover:bg-slate-100">
              <Menu className="w-6 h-6 text-slate-700" />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-600 gap-4">
            <p>© {new Date().getFullYear()} EPI-USE — Employee Hierarchy App</p>
            <div className="flex gap-6">
              <a
                href="https://nextjs.org/learn"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                Documentation
              </a>
              <a href="#" className="hover:text-blue-600">
                Examples
              </a>
              <a href="#" className="hover:text-blue-600">
                Support
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
