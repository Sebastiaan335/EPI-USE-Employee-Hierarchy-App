"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { getGravatarUrl } from "../../lib/gravatar";

type ApiEmployee = {
  id: number;
  name: string;
  surname: string;
  role: string;
  managerId: number | null;
  email?: string;
  birthDate?: string;
  employeeNumber?: string;
  salary?: number;
};

type Employee = ApiEmployee;

const nodeWidth = 300;
const nodeHeight = 140;

// Custom node component
const TreeNode = ({ data }: { data: any }) => {
  const {
    name,
    surname,
    role,
    email,
    level = 0,
    isManager = false,
    subordinateCount = 0,
  } = data;
  const initials = `${name?.[0] || ""}${surname?.[0] || ""}`;
  const avatar = email ? getGravatarUrl(email, 64) : null;

  const levelColors = [
    "from-purple-600 to-pink-600",
    "from-blue-600 to-indigo-600",
    "from-green-600 to-emerald-600",
    "from-orange-600 to-red-600",
    "from-slate-600 to-gray-600",
  ];
  const bgColor = levelColors[Math.min(level, levelColors.length - 1)];

  return (
    <div className="group relative">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 w-full h-full transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-blue-300">
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${bgColor} rounded-t-2xl`} />
        <div className="flex items-start gap-4 mb-4">
          {avatar ? (
            <img
              src={avatar}
              alt={`${name} ${surname}`}
              className="w-14 h-14 rounded-full shadow-lg ring-4 ring-white object-cover"
            />
          ) : (
            <div
              className={`w-14 h-14 bg-gradient-to-br ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-4 ring-white`}
            >
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
              {name} {surname}
            </h3>
            <p className="text-gray-600 text-sm font-medium mb-2 leading-tight">
              {role || "No role specified"}
            </p>
            {isManager && subordinateCount > 0 && (
              <span className="text-xs font-semibold text-blue-700">
                {subordinateCount} report{subordinateCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-purple-500 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

const nodeTypes = { treeNode: TreeNode };

// Build Dagre tree layout
function buildTreeLayout(employees: ApiEmployee[]): { nodes: Node[]; edges: Edge[] } {
  const employeeMap = new Map(employees.map((emp) => [emp.id, emp]));

  const calculateLevel = (employee: ApiEmployee, visited = new Set()): number => {
    if (visited.has(employee.id)) return 0;
    visited.add(employee.id);
    if (!employee.managerId || !employeeMap.has(employee.managerId)) return 0;
    return 1 + calculateLevel(employeeMap.get(employee.managerId)!, visited);
  };

  const getSubordinateCount = (employeeId: number): number => {
    const directReports = employees.filter((emp) => emp.managerId === employeeId);
    return directReports.length + directReports.reduce((sum, emp) => sum + getSubordinateCount(emp.id), 0);
  };

  const nodes: Node[] = employees.map((emp) => {
    const level = calculateLevel(emp);
    const subordinateCount = getSubordinateCount(emp.id);
    return {
      id: emp.id.toString(),
      type: "treeNode",
      data: { ...emp, level, isManager: subordinateCount > 0, subordinateCount },
      position: { x: 0, y: 0 },
    };
  });

  const edges: Edge[] = employees
    .filter((emp) => emp.managerId && employeeMap.has(emp.managerId))
    .map((emp) => ({
      id: `edge-${emp.managerId}-${emp.id}`,
      source: emp.managerId!.toString(),
      target: emp.id.toString(),
      type: "smoothstep",
      animated: true,
    }));

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 80, ranksep: 120 });

  nodes.forEach((node) => g.setNode(node.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));

  dagre.layout(g);
  nodes.forEach((node) => {
    const pos = g.node(node.id);
    node.position = { x: pos.x - nodeWidth / 2, y: pos.y - nodeHeight / 2 };
  });

  return { nodes, edges };
}

export default function OrgTreePage() {
  const [employees, setEmployees] = useState<ApiEmployee[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Employee>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const fetchEmployees = useCallback(async () => {
    const res = await fetch("/api/employees");
    if (!res.ok) return;
    const data = await res.json();
    setEmployees(data);
    const { nodes, edges } = buildTreeLayout(data);
    setNodes(nodes);
    setEdges(edges);
  }, [setNodes, setEdges]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedId(node.id);
    fetch(`/api/employees/${node.id}`)
      .then((r) => r.json())
      .then((emp: Employee) => setEditData(emp))
      .catch(() => setEditData({ id: Number(node.id) }));
  }, []);

  const closeDialog = () => {
    setSelectedId(null);
    setEditData({});
    setErrorMsg(null);
  };

  const onSave = async () => {
    if (!editData?.id) return;

    if (!editData.name || !editData.surname || !editData.role) {
      setErrorMsg("Name, surname, and role are required.");
      return;
    }

    try {
      const res = await fetch(`/api/employees/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Save failed");
      closeDialog();
      await fetchEmployees();
    } catch {
      setErrorMsg("Failed to save changes.");
    }
  };

  const onDelete = async () => {
    if (!selectedId) return;
    try {
      const res = await fetch(`/api/employees/${selectedId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      closeDialog();
      await fetchEmployees();
    } catch {
      setErrorMsg("Failed to delete employee.");
    }
  };

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedId), [nodes, selectedId]);

  return (
    <div className="h-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      {selectedNode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Edit Employee</h2>
            {errorMsg && <p className="text-red-600 mb-3">{errorMsg}</p>}
            <div className="space-y-3">
              <input
                type="text"
                className="w-full border rounded p-2"
                value={editData.name ?? ""}
                onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
                placeholder="First Name"
              />
              <input
                type="text"
                className="w-full border rounded p-2"
                value={editData.surname ?? ""}
                onChange={(e) => setEditData((d) => ({ ...d, surname: e.target.value }))}
                placeholder="Last Name"
              />
              <input
                type="text"
                className="w-full border rounded p-2"
                value={editData.role ?? ""}
                onChange={(e) => setEditData((d) => ({ ...d, role: e.target.value }))}
                placeholder="Role"
              />
              <input
                type="date"
                className="w-full border rounded p-2"
                value={editData.birthDate ?? ""}
                onChange={(e) => setEditData((d) => ({ ...d, birthDate: e.target.value }))}
              />
              <input
                type="text"
                className="w-full border rounded p-2"
                value={editData.employeeNumber ?? ""}
                onChange={(e) => setEditData((d) => ({ ...d, employeeNumber: e.target.value }))}
                placeholder="Employee Number"
              />
              <input
                type="number"
                className="w-full border rounded p-2"
                value={editData.salary ?? ""}
                onChange={(e) => setEditData((d) => ({ ...d, salary: Number(e.target.value) }))}
                placeholder="Salary"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <button onClick={onDelete} className="px-4 py-2 bg-red-500 text-white rounded">
                Delete
              </button>
              <div className="space-x-2">
                <button onClick={closeDialog} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
