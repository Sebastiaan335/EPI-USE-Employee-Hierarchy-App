import React from 'react';
import { Building2, Users, BarChart3, Home, Mail, Phone, MapPin } from 'lucide-react';
import './global.css';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: 'home' | 'employees' | 'orgchart';
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage = 'home' }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, current: currentPage === 'home' },
    { name: 'Employees', href: '/employees', icon: Users, current: currentPage === 'employees' },
    { name: 'Org Chart', href: '/orgchart', icon: BarChart3, current: currentPage === 'orgchart' },
  ];

  const handleNavClick = (href: string) => {
    // In a real app, this would use router navigation
    // For demo purposes, you can implement your routing logic here
    console.log(`Navigate to: ${href}`);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <a href="/" className="header-brand" onClick={(e) => { e.preventDefault(); handleNavClick('/'); }}>
            <Building2 size={32} />
            <span>EPI-USE Africa</span>
          </a>
          
          <nav>
            <ul className="header-nav">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={item.current ? 'active' : ''}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                    >
                      <Icon size={18} />
                      <span className="hidden-sm">{item.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#" onClick={(e) => e.preventDefault()}>About</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Support</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Documentation</a>
          </div>
          
          <div className="footer-copyright">
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>techrecruit@epiuse.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+27 (0) 11 234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Johannesburg, South Africa</span>
              </div>
            </div>
            
            <div className="border-t border-gray-600 pt-4">
              <p>&copy; {new Date().getFullYear()} EPI-USE Africa. All rights reserved.</p>
              <p className="mt-2">
                Employee Management System - Technical Assessment Solution
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;