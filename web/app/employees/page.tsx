import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Edit, Trash2, ChevronUp, ChevronDown, User } from 'lucide-react';
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

interface EmployeesProps {
  employees: Employee[];
  onAddEmployee?: (employee: Omit<Employee, 'id'>) => void;
  onUpdateEmployee?: (id: string, employee: Partial<Employee>) => void;
  onDeleteEmployee?: (id: string) => void;
}

const Employees: React.FC<EmployeesProps> = ({
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee
}) => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Employee>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterRole, setFilterRole] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Get Gravatar URL
  const getGravatarUrl = (email: string, size: number = 40): string => {
    const hash = createHash('md5').update(email.toLowerCase().trim()).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
  };

  // Get manager name
  const getManagerName = (managerId?: string): string => {
    if (!managerId) return 'No Manager';
    const manager = employees.find((emp) => emp.id === managerId);
    return manager ? `${manager.name} ${manager.surname}` : 'Unknown';
  };

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter(employee => {
      const matchesSearch = searchTerm === '' || 
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === '' || employee.role === filterRole;
      
      return matchesSearch && matchesRole;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField] ?? "";
      let bValue = b[sortField] ?? "";
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [employees, searchTerm, sortField, sortDirection, filterRole]);

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: keyof Employee }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const uniqueRoles = [...new Set(employees.map(emp => emp.role))];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Layout currentPage="employees">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="card-title">Employees</h1>
              <p className="card-description">Manage your organization's employee data</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              <Plus size={16} />
              Add Employee
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="controls">
            <div className="search-container">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={16} style={{ color: '#9ca3af' }} />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="form-select"
                style={{ minWidth: '150px' }}
              >
                <option value="">All Roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4" style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Showing {filteredAndSortedEmployees.length} of {employees.length} employees
          </div>
        </div>

        {/* Employee Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Profile</th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('employeeNumber')}
                >
                  <div className="sortable">
                    Employee #
                    <SortIcon field="employeeNumber" />
                  </div>
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('name')}
                >
                  <div className="sortable">
                    Name
                    <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('role')}
                >
                  <div className="sortable">
                    Role
                    <SortIcon field="role" />
                  </div>
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('salary')}
                >
                  <div className="sortable">
                    Salary
                    <SortIcon field="salary" />
                  </div>
                </th>
                <th 
                  className="sortable"
                  onClick={() => handleSort('birthDate')}
                >
                  <div className="sortable">
                    Birth Date
                    <SortIcon field="birthDate" />
                  </div>
                </th>
                <th>Manager</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td>
                    <img
                      className="avatar avatar-sm"
                      src={getGravatarUrl(employee.email)}
                      alt={`${employee.name} ${employee.surname}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=40&d=mp`;
                      }}
                    />
                  </td>
                  <td>
                    <span style={{ fontWeight: '500' }}>{employee.employeeNumber}</span>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '0.125rem' }}>
                        {employee.name} {employee.surname}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{employee.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-blue">{employee.role}</span>
                  </td>
                  <td>
                    {formatCurrency(employee.salary)}
                  </td>
                  <td>
                    {formatDate(employee.birthDate)}
                  </td>
                  <td>
                    {getManagerName(employee.managerId)}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingEmployee(employee)}
                        className="btn btn-sm btn-secondary"
                        style={{ padding: '0.25rem' }}
                        title="Edit Employee"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteEmployee?.(employee.id)}
                        className="btn btn-sm btn-danger"
                        style={{ padding: '0.25rem' }}
                        title="Delete Employee"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedEmployees.length === 0 && (
          <div className="empty-state">
            <User className="empty-state-icon" />
            <h3>No employees found</h3>
            <p>
              {searchTerm || filterRole ? 'Try adjusting your search or filter criteria.' : 'Get started by adding a new employee.'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Employees;