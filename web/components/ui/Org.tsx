"use client";
import React, { useState, useRef } from "react";
import {
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Edit,
  Trash2,
} from "lucide-react";
import { createHash } from 'crypto';

export interface Employee {
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

export interface TreeNode extends Employee {
  children: TreeNode[];
}

export interface OrgChartProps {
  employees: Employee[]; // required now (no mock data fallback)
  onUpdateEmployee?: (id: string, employee: Partial<Employee>) => void;
  onDeleteEmployee?: (id: string) => void;
}

const OrgChart: React.FC<OrgChartProps> = ({
  employees,
  onUpdateEmployee,
  onDeleteEmployee,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [highlightedEmployee, setHighlightedEmployee] = useState<
    string | null
  >(null);

  const chartRef = useRef<HTMLDivElement>(null);

  // ✅ Browser-safe Gravatar URL
  const getGravatarUrl = (email: string, size: number = 40): string => {
    const hash = createHash('md5').update(email.toLowerCase().trim()).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
  };

  // Build tree structure
  const buildTree = (employees: Employee[]): TreeNode[] => {
    const nodeMap: { [key: string]: TreeNode } = {};
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

  // Search functionality
  const searchEmployees = (term: string): Employee[] => {
    if (!term) return [];
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(term.toLowerCase()) ||
        emp.surname.toLowerCase().includes(term.toLowerCase()) ||
        emp.employeeNumber.toLowerCase().includes(term.toLowerCase()) ||
        emp.role.toLowerCase().includes(term.toLowerCase())
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
    if (direction === "in") {
      setZoomLevel((prev) => Math.min(prev * 1.2, 3));
    } else if (direction === "out") {
      setZoomLevel((prev) => Math.max(prev / 1.2, 0.5));
    } else {
      setZoomLevel(1);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const renderNode = (node: TreeNode): JSX.Element => {
    const isHighlighted = highlightedEmployee === node.id;
    const hasChildren = node.children.length > 0;

    return (
      <div
        key={node.id}
        className={`flex flex-col items-center m-4 p-4 rounded-lg shadow-md bg-white border-2 ${
          isHighlighted ? "border-blue-500" : "border-gray-200"
        }`}
        style={{
          transform: `scale(${zoomLevel})`,
        }}
      >
        <img
          src={getGravatarUrl(node.email)}
          alt={node.name}
          className="w-16 h-16 rounded-full mb-2"
        />
        <h3 className="font-bold">
          {node.name} {node.surname}
        </h3>
        <p className="text-sm text-gray-600">{node.role}</p>
        <p className="text-xs text-gray-400">{node.employeeNumber}</p>
        <p className="text-xs">{formatCurrency(node.salary)}</p>
        <div className="flex space-x-2 mt-2">
          {onUpdateEmployee && (
            <button
              onClick={() => onUpdateEmployee(node.id, {})}
              className="text-blue-500 hover:text-blue-700"
            >
              <Edit size={16} />
            </button>
          )}
          {onDeleteEmployee && (
            <button
              onClick={() => onDeleteEmployee(node.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        {hasChildren && (
          <div className="flex space-x-6 mt-4">
            {node.children.map((child) => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree(employees);

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center border rounded px-2">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="ml-2 outline-none"
          />
        </div>
        <button
          onClick={() => handleZoom("in")}
          className="p-2 border rounded hover:bg-gray-100"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => handleZoom("out")}
          className="p-2 border rounded hover:bg-gray-100"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={() => handleZoom("reset")}
          className="p-2 border rounded hover:bg-gray-100"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Org Chart */}
      <div ref={chartRef} className="flex justify-center overflow-auto">
        {tree.map((root) => renderNode(root))}
      </div>
    </div>
  );
};

export default OrgChart;