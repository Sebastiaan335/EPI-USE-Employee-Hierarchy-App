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
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";

type ApiNode = { id: string; label: string; role?: string };
type ApiEdge = { id: string; source: string; target: string };

type Employee = {
  id: number;
  name: string;
  surname: string;
  role: string;
  managerId: number | null;
};

const nodeWidth = 220;
const nodeHeight = 72;

function layout(nodes: Node[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "TB", nodesep: 40, ranksep: 80 });

  nodes.forEach((n) => g.setNode(n.id, { width: nodeWidth, height: nodeHeight }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  nodes.forEach((n) => {
    const pos = g.node(n.id);
    n.position = { x: pos.x - nodeWidth / 2, y: pos.y - nodeHeight / 2 };
  });

  return { nodes, edges };
}

export default function OrgPage() {
  const [raw, setRaw] = useState<{ nodes: ApiNode[]; edges: ApiEdge[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Employee>>({});

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const fetchGraph = useCallback(() => {
    setError(null);
    fetch("/api/org")
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j?.error || "Failed to load org");
        }
        return r.json();
      })
      .then((j) => setRaw(j))
      .catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  // Build RF nodes/edges
  useEffect(() => {
    if (!raw) return;
    const rfNodes: Node[] = raw.nodes.map((n) => ({
      id: n.id,
      data: { label: n.label, role: n.role },
      position: { x: 0, y: 0 },
      style: {
        width: nodeWidth,
        height: nodeHeight,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
        padding: 8,
        background: "white",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
      },
    }));

    const rfEdges: Edge[] = raw.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      animated: false,
    }));

    const { nodes: laidNodes, edges: laidEdges } = layout(rfNodes, rfEdges);
    setNodes(laidNodes);
    setEdges(laidEdges);
  }, [raw, setNodes, setEdges]);

interface OnNodeClickParams {
    event: React.MouseEvent;
    node: Node;
}

interface EditData extends Partial<Employee> {}

const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node): void => {
        setSelectedId(node.id);
        // prime edit form with current values (best-effort fetch)
        fetch(`/api/employees/${node.id}`)
            .then((r) => r.json())
            .then((emp: Employee) =>
                setEditData({
                    id: emp.id,
                    name: emp.name,
                    surname: emp.surname,
                    role: emp.role,
                    managerId: emp.managerId,
                } as EditData)
            )
            .catch(() => {
                setEditData({ id: Number(node.id) } as EditData);
            });
    },
    []
);

  const closeDialog = () => {
    setSelectedId(null);
    setEditData({});
  };

  const onDelete = async () => {
    if (!selectedId) return;
    if (!confirm("Delete this employee?")) return;
    const res = await fetch(`/api/employees/${selectedId}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Failed to delete.");
      return;
    }
    closeDialog();
    fetchGraph();
  };

  const onSave = async () => {
    if (!editData?.id) return;
    const res = await fetch(`/api/employees/${editData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editData.name,
        surname: editData.surname,
        role: editData.role,
        managerId: editData.managerId ?? null,
      }),
    });
    if (!res.ok) {
      alert("Failed to save changes.");
      return;
    }
    closeDialog();
    fetchGraph();
  };

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedId) as Node<{ label: string; role?: string }> | undefined,
    [nodes, selectedId]
  );

  return (
    <div className="p-4 h-[calc(100vh-64px)]">
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-2xl font-bold">Organisation Chart</h1>
        <button
          onClick={fetchGraph}
          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
        >
          Refresh
        </button>
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>

      <div className="h-full border rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      {/* Simple dialog for node actions */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-2">
              <h2 className="text-lg font-semibold">Edit Employee</h2>
              <p className="text-sm text-gray-500">
                {selectedNode.data?.label} {selectedNode.data?.role ? `— ${selectedNode.data?.role}` : ""}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm">
                <span className="block text-gray-600">Name</span>
                <input
                  className="mt-1 w-full rounded-md border px-2 py-1"
                  value={editData.name ?? ""}
                  onChange={(e) => setEditData((d) => ({ ...d, name: e.target.value }))}
                />
              </label>
              <label className="text-sm">
                <span className="block text-gray-600">Surname</span>
                <input
                  className="mt-1 w-full rounded-md border px-2 py-1"
                  value={editData.surname ?? ""}
                  onChange={(e) => setEditData((d) => ({ ...d, surname: e.target.value }))}
                />
              </label>
              <label className="text-sm col-span-2">
                <span className="block text-gray-600">Role</span>
                <input
                  className="mt-1 w-full rounded-md border px-2 py-1"
                  value={editData.role ?? ""}
                  onChange={(e) => setEditData((d) => ({ ...d, role: e.target.value }))}
                />
              </label>
              <label className="text-sm col-span-2">
                <span className="block text-gray-600">Manager ID</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border px-2 py-1"
                  value={editData.managerId ?? ""}
                  onChange={(e) =>
                    setEditData((d) => ({
                      ...d,
                      managerId: e.target.value === "" ? null : Number(e.target.value),
                    }))
                  }
                />
              </label>
            </div>

            <div className="mt-4 flex justify-between">
              <button
                onClick={onDelete}
                className="rounded-md border border-red-300 bg-red-50 px-3 py-1 text-sm text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
              <div className="space-x-2">
                <button
                  onClick={closeDialog}
                  className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  className="rounded-md bg-black px-3 py-1 text-sm text-white hover:bg-gray-800"
                >
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
