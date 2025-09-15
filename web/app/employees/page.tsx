"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  User,
} from "lucide-react";
import Layout from "../../components/layout";
import { getGravatarUrl } from "../../lib/gravatar";

interface Employee {
  id: number;
  employeenumber: string;
  name: string;
  surname: string;
  birthdate: string;
  salary: number;
  role: string;
  managerid?: number | null;
  email: string;
}

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Employee>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filterRole, setFilterRole] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>({});

  // Fetch employees from API
  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then(setEmployees);
  }, []);

  // Delete employee
  const handleDelete = async (id: number) => {
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  // Handle add
  const handleAdd = async () => {
    try {
      const payload = {
        ...formData,
        // Ensure correct ISO format
        birthdate: formData.birthdate
          ? new Date(formData.birthdate).toISOString() : null,
      };

      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errText = await res.text();
        alert("Failed to add employee: " + errText);
        return;
      }
      const newEmp = await res.json();
      setEmployees((prev) => [...prev, newEmp]);
      setShowAddModal(false);
      setFormData({});
    } catch (err) {
      console.error(err);
      alert("Error adding employee");
    }
  };

  const getManagerName = (managerid?: number | null) => {
    if (!managerid) return "No Manager";
    const manager = employees.find((emp) => emp.id === managerid);
    return manager ? `${manager.name} ${manager.surname}` : "Unknown";
  };

  // Filtering & sorting
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees.filter((employee) => {
      const matchesSearch =
        searchTerm === "" ||
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeenumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = filterRole === "" || employee.role === filterRole;
      return matchesSearch && matchesRole;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField] ?? "";
      let bValue = b[sortField] ?? "";
      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [employees, searchTerm, sortField, sortDirection, filterRole]);

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ field }: { field: keyof Employee }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const uniqueRoles = [...new Set(employees.map((emp) => emp.role))];

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" });

  return (
    <Layout currentPage="employees">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="card-title">Employees</h1>
            <p className="card-description">
              Manage your organization's employee data
            </p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus size={16} />
            Add Employee
          </button>
        </div>

        {/* Search + Filter */}
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
              <Filter size={16} style={{ color: "#9ca3af" }} />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="form-select"
                style={{ minWidth: "150px" }}
              >
                <option value="">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredAndSortedEmployees.length} of {employees.length} employees
          </div>
        </div>

        {/* Employee Table */}
        <div className="table-container" style={{ maxHeight: "500px", overflowY: "auto" }}>
          <table className="table" style={{ width: "100%", tableLayout: "fixed" }}>
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                <th style={{ width: "80px" }}>Profile</th>
                <th onClick={() => handleSort("employeenumber")} className="sortable" style={{ width: "110px" }}>
                  <div className="flex items-center gap-1">
                    Employee #
                    <SortIcon field="employeenumber" />
                  </div>
                </th>
                <th onClick={() => handleSort("name")} className="sortable" style={{ width: "200px" }}>
                  <div className="flex items-center gap-1">
                    Name
                    <SortIcon field="name" />
                  </div>
                </th>
                <th onClick={() => handleSort("role")} className="sortable" style={{ width: "110px" }}>
                  <div className="flex items-center gap-1">
                    Role
                    <SortIcon field="role" />
                  </div>
                </th>
                <th onClick={() => handleSort("salary")} className="sortable">
                  <div className="flex items-center gap-1">
                    Salary
                    <SortIcon field="salary" />
                  </div>
                </th>
                <th onClick={() => handleSort("birthdate")} className="sortable">
                  <div className="flex items-center gap-1">
                    Birth Date
                    <SortIcon field="birthdate" />
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
                      src={getGravatarUrl(employee.email, 40)}
                      alt={`${employee.name} ${employee.surname}`}
                    />
                  </td>
                  <td>
                    <strong>{employee.employeenumber}</strong>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 500 }}>
                        {employee.name} {employee.surname}
                      </div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-blue">{employee.role}</span>
                  </td>
                  <td>{formatCurrency(employee.salary)}</td>
                  <td>{formatDate(employee.birthdate)}</td>
                  <td>{getManagerName(employee.managerid)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingEmployee(employee)}
                        className="btn btn-sm btn-secondary"
                        title="Edit Employee"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="btn btn-sm btn-danger"
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
              {searchTerm || filterRole
                ? "Try adjusting your search or filter criteria."
                : "Get started by adding a new employee."}
            </p>
          </div>
        )}

        {/* Add Employee Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Add Employee</h2>
              <div className="flex flex-col gap-3">
                <input
                  className="form-input"
                  placeholder="Employee Number"
                  value={formData.employeenumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, employeenumber: e.target.value })
                  }
                />
                <input
                  className="form-input"
                  placeholder="First Name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  className="form-input"
                  placeholder="Surname"
                  value={formData.surname || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, surname: e.target.value })
                  }
                />
                <input
                  className="form-input"
                  type="date"
                  value={formData.birthdate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, birthdate: e.target.value })
                  }
                />
                <input
                  className="form-input"
                  type="number"
                  placeholder="Salary"
                  value={formData.salary || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: Number(e.target.value) })
                  }
                />
                <input
                  className="form-input"
                  placeholder="Role"
                  value={formData.role || ""}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                <input
                  className="form-input"
                  type="email"
                  placeholder="Email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <select
                  className="form-select"
                  value={formData.managerid ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      managerid: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                >
                  <option value="">No Manager (CEO)</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} {emp.surname}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAdd}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeesPage;
