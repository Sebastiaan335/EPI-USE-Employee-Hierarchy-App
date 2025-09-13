import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Employee Hierarchy App",
  description: "Manage and visualize employees in the organisation",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[var(--brand-bg)] text-[var(--brand-text)]">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Employee Hierarchy
            </a>
            <nav className="space-x-6 text-sm font-medium">
              <a href="/employees" className="hover:text-blue-600">Employees</a>
              <a href="/org" className="hover:text-blue-600">Org Chart</a>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} EPI-USE — Employee Hierarchy App
        </footer>
      </body>
    </html>
  );
}
