"use client";
import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Edit, Trash2, ChevronUp, ChevronDown, User } from 'lucide-react';
import { createHash } from 'crypto';

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
  employees?: Employee[];
  onAddEmployee?: (employee: Omit<Employee, 'id'>) => void;
  onUpdateEmployee?: (id: string, employee: Partial<Employee>) => void;
  onDeleteEmployee?: (id: string) => void;
}

const Employees: React.FC<EmployeesProps> = ({
  employees: propEmployees,
  onAddEmployee,
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
      salary: 75000,
      role: 'CEO',
      email: 'john.smith@company.com'
    },
    {
      id: '2',
      employeeNumber: 'EMP002',
      name: 'Sarah',
      surname: 'Johnson',
      birthDate: '1990-07-22',
      salary: 65000,
      role: 'Senior Developer',
      managerId: '1',
      email: 'sarah.johnson@company.com'
    },
    {
      id: '3',
      employeeNumber: 'EMP003',
      name: 'Mike',
      surname: 'Davis',
      birthDate: '1988-11-08',
      salary: 70000,
      role: 'Team Lead',
      managerId: '1',
      email: 'mike.davis@company.com'
    },
    {
      id: '4',
      employeeNumber: 'EMP004',
      name: 'Lisa',
      surname: 'Brown',
      birthDate: '1992-05-30',
      salary: 60000,
      role: 'Developer',
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
      role: 'Junior Developer',
      managerId: '3',
      email: 'david.wilson@company.com'
    }
  ]);

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
    const manager = employees.find(emp => emp.id === managerId);
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
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Provide default values if undefined
      if (aValue === undefined || aValue === null) aValue = '';
      if (bValue === undefined || bValue === null) bValue = '';

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
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Employees</h1>
              <p className="text-gray-600">Manage your organization's employee data</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAndSortedEmployees.length} of {employees.length} employees
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Profile
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('employeeNumber')}
                  >
                    <div className="flex items-center gap-1">
                      Employee #
                      <SortIcon field="employeeNumber" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('role')}
                  >
                    <div className="flex items-center gap-1">
                      Role
                      <SortIcon field="role" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('salary')}
                  >
                    <div className="flex items-center gap-1">
                      Salary
                      <SortIcon field="salary" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('birthDate')}
                  >
                    <div className="flex items-center gap-1">
                      Birth Date
                      <SortIcon field="birthDate" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Manager
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          className="h-10 w-10 rounded-full"
                          src={getGravatarUrl(employee.email)}
                          alt={`${employee.name} ${employee.surname}`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://www.gravatar.com/avatar/00000000000000000000000000000000?s=40&d=mp`;
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {employee.employeeNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name} {employee.surname}
                      </div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {employee.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(employee.salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(employee.birthDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getManagerName(employee.managerId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingEmployee(employee)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteEmployee?.(employee.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAndSortedEmployees.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterRole ? 'Try adjusting your search or filter criteria.' : 'Get started by adding a new employee.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Employees;