import React, { useState, useRef } from 'react';
import { Search, ZoomIn, ZoomOut, RotateCcw, Edit, Trash2, User, Building2 } from 'lucide-react';
import { createHash } from 'crypto';
import Layout from '../../app/layout';

interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  surname: string;
  birthDate: string;
  salary: number;
  role: string;
  managerId?: string;
  email: string;
}

interface TreeNode extends Employee {
  children: TreeNode[];
}

interface OrgChartProps {
  employees?: Employee[];
  onUpdateEmployee?: (id: string, employee: Partial<Employee>) => void;
  onDeleteEmployee?: (id: string) => void;
}

const OrgChart: React.FC<OrgChartProps> = ({
  employees: propEmployees,
  onUpdateEmployee,
  onDeleteEmployee
}) => {
  // Mock data - in real app, this would come from props/API
  const [employees] = useState<Employee[]>(propEmployees || [
    {
      id: '1',
      employeeNumber: 'EMP001',
      name: 'John',
      surname: 'Smith',
      birthDate: '1985-03-15',
      salary: 95000,
      role: 'CEO',
      email: 'john.smith@company.com'
    },
    {
      id: '2',
      employeeNumber: 'EMP002',
      name: 'Sarah',
      surname: 'Johnson',
      birthDate: '1990-07-22',
      salary: 75000,
      role: 'CTO',
      managerId: '1',
      email: 'sarah.johnson@company.com'
    },
    {
      id: '3',
      employeeNumber: 'EMP003',
      name: 'Mike',
      surname: 'Davis',
      birthDate: '1988-11-08',
      salary: 72000,
      role: 'Head of Sales',
      managerId: '1',
      email: 'mike.davis@company.com'
    },
    {
      id: '4',
      employeeNumber: 'EMP004',
      name: 'Lisa',
      surname: 'Brown',
      birthDate: '1992-05-30',
      salary: 65000,
      role: 'Senior Developer',
      managerId: '2',
      email: 'lisa.brown@company.com'
    },
    {
      id: '5',
      employeeNumber: 'EMP005',
      name: 'David',
      surname: 'Wilson',
      birthDate: '1987-09-12',
      salary: 58000,
      role: 'Developer',
      managerId: '2',
      email: 'david.wilson@company.com'
    },
    {
      id: '6',
      employeeNumber: 'EMP006',
      name: 'Emma',
      surname: 'Taylor',
      birthDate: '1991-12-03',
      salary: 62000,
      role: 'Sales Manager',
      managerId: '3',
      email: 'emma.taylor@company.com'
    },
    {
      id: '7',
      employeeNumber: 'EMP007',
      name: 'James',
      surname: 'Anderson',
      birthDate: '1989-04-18',
      salary: 55000,
      role: 'Junior Developer',
      managerId: '4',
      email: 'james.anderson@company.com'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [highlightedEmployee, setHighlightedEmployee] = useState<string | null>(null);
  
  const chartRef = useRef<HTMLDivElement>(null);

  // Get Gravatar URL
  const getGravatarUrl = (email: string, size: number = 40): string => {
    const hash = createHash('md5').update(email.toLowerCase().trim()).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
  };

  // Build tree structure from flat employee data
  const buildTree = (employees: Employee[]): TreeNode[] => {
    const nodeMap: { [key: string]: TreeNode } = {};
    const roots: TreeNode[] = [];

    // Create nodes
    employees.forEach(emp => {
      nodeMap[emp.id] = { ...emp, children: [] };
    });

    // Build hierarchy
    employees.forEach(emp => {
      const node = nodeMap[emp.id];
      if (emp.managerId && nodeMap[emp.managerId]) {
        nodeMap[emp.managerId].children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  // Search functionality
  const searchEmployees = (searchTerm: string): Employee[] => {
    if (!searchTerm) return [];
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      const results = searchEmployees(term);
      if (results.length > 0) {
        setHighlightedEmployee(results[0].id);
        setSelectedEmployee(results[0]);
      }
    } else {
      setHighlightedEmployee(null);
      setSelectedEmployee(null);
    }
  };

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (direction === 'in') {
      setZoomLevel(prev => Math.min(prev * 1.2, 3));
    } else if (direction === 'out') {
      setZoomLevel(prev => Math.max(prev / 1.2, 0.5));
    } else {
      setZoomLevel(1);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderNode = (node: TreeNode, level: number = 0): JSX.Element => {
    const isHighlighted = highlightedEmployee === node.id;
    const hasChildren = node.children.length > 0;
    const isRoot = level === 0;

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Employee Card */}
        <div 
          className={`org-node ${isHighlighted ? 'highlighted' : ''} ${isRoot ? 'root' : ''}`}
          onClick={() => {
            setSelectedEmployee(node);
            setHighlightedEmployee(node.id);
          }}
        >
          <div className="org-node-header">
            <img
              className="avatar avatar-md"
              src={getGravatarUrl(node.email, 48)}
              alt={`${node.name} ${node.surname}`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=48&d=mp`;
              }}
            />
            <div className="org-node-info">
              <h3>{node.name} {node.surname}</h3>
              <p>{node.employeeNumber}</p>
              <p className="org-node-role">{node.role}</p>
            </div>
          </div>
          
          <div className="org-node-details">
            <div className="flex justify-between items-center">
              <span>Salary:</span>
              <span style={{ fontWeight: '500' }}>{formatCurrency(node.salary)}</span>
            </div>
            {hasChildren && (
              <div className="flex justify-between items-center mt-1">
                <span>Reports:</span>
                <span style={{ fontWeight: '500', color: '#10b981' }}>{node.children.length}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="org-node-actions">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEmployee(node);
              }}
              className="btn btn-sm btn-primary"
              style={{ padding: '0.25rem' }}
              title="Edit Employee"
            >
              <Edit size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteEmployee?.(node.id);
              }}
              className="btn btn-sm btn-danger"
              style={{ padding: '0.25rem' }}
              title="Delete Employee"
            >
              <Trash2 size={12} />
            </button>
          </div>

          {isRoot && (
            <div style={{
              position: 'absolute',
              top: '-0.25rem',
              right: '-0.25rem',
              backgroundColor: '#8b5cf6',
              color: 'white',
              fontSize: '0.75rem',
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px'
            }}>
              {node.role}
            </div>
          )}
        </div>

        {/* Connection Lines */}
        {hasChildren && (
          <div className="flex flex-col items-center">
            <div className="org-connection" style={{ height: '1.5rem' }}></div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="org-connection-horizontal" style={{ width: `${(node.children.length - 1) * 280 + 140}px` }}></div>
            </div>
            <div className="flex">
              {node.children.map((_, index) => (
                <div key={index} className="flex flex-col items-center" style={{ width: '280px' }}>
                  <div className="org-connection" style={{ height: '1.5rem' }}></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Children */}
        {hasChildren && (
          <div className="flex items-start gap-4">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree(employees);
  const searchResults = searchEmployees(searchTerm);

  return (
    <Layout currentPage="orgchart">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="card-title">Organization Chart</h1>
              <p className="card-description">Visual representation of your organization's hierarchy</p>
            </div>
            <div className="zoom-controls">
              <button
                onClick={() => handleZoom('out')}
                className="btn btn-sm btn-secondary"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="zoom-level">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => handleZoom('in')}
                className="btn btn-sm btn-secondary"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => handleZoom('reset')}
                className="btn btn-sm btn-secondary"
                title="Reset View"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="card mb-6">
          <div className="controls">
            <div className="search-container">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search employees in hierarchy..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="flex items-center">
              <Building2 size={16} style={{ marginRight: '0.5rem' }} />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Total Employees: {employees.length}
              </span>
            </div>
          </div>

          {/* Search Results */}
          {searchTerm && searchResults.length > 0 && (
            <div className="mt-4" style={{ padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#1e40af', marginBottom: '0.5rem' }}>
                Search Results ({searchResults.length}):
              </p>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {searchResults.slice(0, 5).map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setHighlightedEmployee(emp.id);
                      setSelectedEmployee(emp);
                    }}
                    className="badge badge-blue"
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    {emp.name} {emp.surname} - {emp.role}
                  </button>
                ))}
                {searchResults.length > 5 && (
                  <span style={{ fontSize: '0.875rem', color: '#2563eb' }}>
                    +{searchResults.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Organization Chart */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div 
            ref={chartRef}
            className="org-chart"
            style={{ 
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'top center'
            }}
          >
            {tree.length > 0 ? (
              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  {tree.map(rootNode => renderNode(rootNode))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <User className="empty-state-icon" />
                <h3>No organizational structure found</h3>
                <p>Add employees and set up reporting relationships to see the hierarchy.</p>
              </div>
            )}
          </div>
        </div>

        {/* Employee Details Panel */}
        {selectedEmployee && (
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '24rem',
            height: '100vh',
            backgroundColor: 'white',
            boxShadow: '-4px 0 8px rgba(0, 0, 0, 0.1)',
            zIndex: 50,
            overflowY: 'auto',
            padding: '1.5rem'
          }}>
            <div className="flex justify-between items-start mb-6">
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Employee Details</h2>
              <button
                onClick={() => {
                  setSelectedEmployee(null);
                  setHighlightedEmployee(null);
                }}
                className="btn btn-sm btn-secondary"
                style={{ padding: '0.25rem 0.5rem' }}
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {/* Profile */}
              <div className="text-center">
                <img
                  className="avatar avatar-xl"
                  src={getGravatarUrl(selectedEmployee.email, 80)}
                  alt={`${selectedEmployee.name} ${selectedEmployee.surname}`}
                  style={{ margin: '0 auto 1rem' }}
                />
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {selectedEmployee.name} {selectedEmployee.surname}
                </h3>
                <p style={{ color: '#6b7280' }}>{selectedEmployee.role}</p>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Employee Number:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{selectedEmployee.employeeNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Email:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{selectedEmployee.email}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Salary:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{formatCurrency(selectedEmployee.salary)}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Birth Date:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {new Date(selectedEmployee.birthDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Manager:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {selectedEmployee.managerId 
                      ? employees.find(e => e.id === selectedEmployee.managerId)?.name + ' ' + 
                        employees.find(e => e.id === selectedEmployee.managerId)?.surname
                      : 'No Manager'
                    }
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3" style={{ paddingTop: '1rem' }}>
                <button
                  onClick={() => onUpdateEmployee?.(selectedEmployee.id, selectedEmployee)}
                  className="btn btn-primary flex-1"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDeleteEmployee?.(selectedEmployee.id);
                    setSelectedEmployee(null);
                  }}
                  className="btn btn-danger flex-1"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overlay for mobile */}
        {selectedEmployee && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 40,
              display: 'none'
            }}
            className="lg:hidden"
            onClick={() => {
              setSelectedEmployee(null);
              setHighlightedEmployee(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default OrgChart;