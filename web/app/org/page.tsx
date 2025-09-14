"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Edit,
  Trash2,
  User,
  Building2,
} from "lucide-react";
import Layout from "../../components/ui/layout";
import { getGravatarUrl } from "../../lib/gravatar";

interface Employee {
  id: number;
  employeeNumber: string;
  name: string;
  surname: string;
  birthDate: string;
  salary: number;
  role: string;
  managerId?: number | null;
  email: string;
}

interface TreeNode extends Employee {
  children: TreeNode[];
}

const OrgChartPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [highlightedEmployee, setHighlightedEmployee] = useState<number | null>(
    null
  );
  const chartRef = useRef<HTMLDivElement>(null);

  // Fetch employees
  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then(setEmployees);
  }, []);

  // Build tree from employees
  const buildTree = (employees: Employee[]): TreeNode[] => {
    const nodeMap: Record<number, TreeNode> = {};
    const roots: TreeNode[] = [];

    employees.forEach((emp) => {
      nodeMap[emp.id] = { ...emp, children: [] };
    });

    employees.forEach((emp) => {
      const node = nodeMap[emp.id];
      if (emp.managerId && nodeMap[emp.managerId]) {
        nodeMap[emp.managerId].children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  // Search
  const searchEmployees = (term: string) => {
    if (!term) return [];
    return employees.filter(
      (e) =>
        e.name.toLowerCase().includes(term.toLowerCase()) ||
        e.surname.toLowerCase().includes(term.toLowerCase()) ||
        e.employeeNumber.toLowerCase().includes(term.toLowerCase()) ||
        e.role.toLowerCase().includes(term.toLowerCase())
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

  const handleZoom = (direction: "in" | "out" | "reset") => {
    if (direction === "in") setZoomLevel((z) => Math.min(z * 1.2, 3));
    if (direction === "out") setZoomLevel((z) => Math.max(z / 1.2, 0.5));
    if (direction === "reset") setZoomLevel(1);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
      amount
    );

  const handleDelete = async (id: number) => {
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setSelectedEmployee(null);
  };

  const renderNode = (node: TreeNode, level = 0): JSX.Element => {
    const isHighlighted = highlightedEmployee === node.id;
    const hasChildren = node.children.length > 0;
    const isRoot = level === 0;

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Node Card */}
        <div
          className={`org-node ${isHighlighted ? "highlighted" : ""} ${
            isRoot ? "root" : ""
          }`}
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
            />
            <div className="org-node-info">
              <h3>
                {node.name} {node.surname}
              </h3>
              <p>{node.employeeNumber}</p>
              <p className="org-node-role">{node.role}</p>
            </div>
          </div>

          <div className="org-node-details">
            <div className="flex justify-between">
              <span>Salary:</span>
              <span style={{ fontWeight: 500 }}>{formatCurrency(node.salary)}</span>
            </div>
            {hasChildren && (
              <div className="flex justify-between mt-1">
                <span>Reports:</span>
                <span style={{ fontWeight: 500, color: "#10b981" }}>
                  {node.children.length}
                </span>
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
              style={{ padding: "0.25rem" }}
              title="Edit"
            >
              <Edit size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(node.id);
              }}
              className="btn btn-sm btn-danger"
              style={{ padding: "0.25rem" }}
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Connection Lines */}
        {hasChildren && (
          <div className="flex flex-col items-center">
            <div className="org-connection" style={{ height: "1.5rem" }} />
            <div style={{ display: "flex" }}>
              <div
                className="org-connection-horizontal"
                style={{ width: `${node.children.length * 280}px` }}
              />
            </div>
            <div className="flex">
              {node.children.map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center"
                  style={{ width: "280px" }}
                >
                  <div className="org-connection" style={{ height: "1.5rem" }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Render children */}
        {hasChildren && (
          <div className="flex gap-4">
            {node.children.map((child) => renderNode(child, level + 1))}
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="card-title">Organization Chart</h1>
            <p className="card-description">
              Visual representation of your organization's hierarchy
            </p>
          </div>
          <div className="zoom-controls">
            <button
              onClick={() => handleZoom("out")}
              className="btn btn-sm btn-secondary"
            >
              <ZoomOut size={16} />
            </button>
            <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => handleZoom("in")}
              className="btn btn-sm btn-secondary"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => handleZoom("reset")}
              className="btn btn-sm btn-secondary"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="card mb-6">
          <div className="controls">
            <div className="search-container">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="flex items-center">
              <Building2 size={16} className="mr-2" />
              <span className="text-sm text-gray-500">
                Total Employees: {employees.length}
              </span>
            </div>
          </div>

          {searchTerm && searchResults.length > 0 && (
            <div className="mt-4 bg-blue-100 p-3 rounded-md">
              <p className="text-blue-800 text-sm mb-2">
                Search Results ({searchResults.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {searchResults.slice(0, 5).map((emp) => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      setHighlightedEmployee(emp.id);
                      setSelectedEmployee(emp);
                    }}
                    className="badge badge-blue"
                  >
                    {emp.name} {emp.surname} - {emp.role}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Org Chart */}
        <div className="card" style={{ padding: 0 }}>
          <div
            ref={chartRef}
            className="org-chart"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "top center",
            }}
          >
            {tree.length > 0 ? (
              <div className="flex justify-center">
                <div className="flex flex-col items-center">
                  {tree.map((root) => renderNode(root))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <User className="empty-state-icon" />
                <h3>No organizational structure found</h3>
                <p>Add employees and set manager relationships to see hierarchy.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrgChartPage;
