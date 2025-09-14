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
import Layout from "../../components/layout";
import { getGravatarUrl } from "../../lib/gravatar";
import dagre from "dagre";

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

interface PositionedNode extends Employee {
  x: number;
  y: number;
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

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then(setEmployees);
  }, []);

  // Build dagre layout
  const computeLayout = (emps: Employee[]): { nodes: PositionedNode[]; edges: { source: number; target: number }[] } => {
    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 100 });
    g.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 220;
    const nodeHeight = 100;

    emps.forEach((emp) => {
      g.setNode(emp.id.toString(), { width: nodeWidth, height: nodeHeight });
    });

    const edges: { source: number; target: number }[] = [];
    emps.forEach((emp) => {
      if (emp.managerId) {
        g.setEdge(emp.managerId.toString(), emp.id.toString());
        edges.push({ source: emp.managerId, target: emp.id });
      }
    });

    dagre.layout(g);

    const nodes: PositionedNode[] = emps.map((emp) => {
      const pos = g.node(emp.id.toString());
      return { ...emp, x: pos.x, y: pos.y };
    });

    return { nodes, edges };
  };

  const { nodes, edges } = computeLayout(employees);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
      amount
    );

  const handleDelete = async (id: number) => {
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setSelectedEmployee(null);
  };

  const handleZoom = (direction: "in" | "out" | "reset") => {
    if (direction === "in") setZoomLevel((z) => Math.min(z * 1.2, 3));
    if (direction === "out") setZoomLevel((z) => Math.max(z / 1.2, 0.5));
    if (direction === "reset") setZoomLevel(1);
  };

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
            <button onClick={() => handleZoom("out")} className="btn btn-sm btn-secondary">
              <ZoomOut size={16} />
            </button>
            <span className="zoom-level">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={() => handleZoom("in")} className="btn btn-sm btn-secondary">
              <ZoomIn size={16} />
            </button>
            <button onClick={() => handleZoom("reset")} className="btn btn-sm btn-secondary">
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
        </div>

        {/* Org Chart with dagre positions */}
        <div className="card" style={{ position: "relative", overflow: "auto", minHeight: "600px" }}>
          <div
            ref={chartRef}
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "top center",
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            {nodes.length > 0 ? (
              <div>
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    className={`org-node ${highlightedEmployee === node.id ? "highlighted" : ""}`}
                    style={{
                      position: "absolute",
                      left: `${node.x - 110}px`,
                      top: `${node.y - 50}px`,
                      width: "220px",
                      height: "100px",
                    }}
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
                    </div>
                    <div className="org-node-actions">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEmployee(node);
                        }}
                        className="btn btn-sm btn-primary"
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
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
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
