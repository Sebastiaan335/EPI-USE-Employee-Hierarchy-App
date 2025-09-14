// ========================
// Root Layout
// ========================
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Employee Hierarchy App",
  description: "Manage and visualize employees in the organisation",
};

function ActiveLink({ href, children }: { href: string; children: React.ReactNode }) {
  const h = headers();
  const pathname = h.get("x-pathname") || "/"; // set via middleware if desired; fallback keeps simple
  const isActive = pathname === href;
  return (
    <Link href={href} className={`nav-link ${isActive ? "nav-active" : ""}`}>
      {children}
    </Link>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Employee Hierarchy
            </Link>
            <nav className="hidden sm:flex items-center gap-6">
              <ActiveLink href="/employees">Employees</ActiveLink>
              <ActiveLink href="/org">Org Chart</ActiveLink>
            </nav>
            <div className="sm:hidden">
              <details className="relative">
                <summary className="list-none cursor-pointer nav-link">Menu</summary>
                <div className="absolute right-0 mt-2 w-44 card py-2">
                  <Link href="/employees" className="block px-4 py-2 nav-link">
                    Employees
                  </Link>
                  <Link href="/org" className="block px-4 py-2 nav-link">
                    Org Chart
                  </Link>
                </div>
              </details>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">{children}</main>

        {/* Footer */}
        <footer className="bg-white/90 backdrop-blur-sm border-t border-slate-200 py-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} EPI-USE — Employee Hierarchy App
        </footer>
      </body>
    </html>
  );
}