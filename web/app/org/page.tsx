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
import ELK from "elkjs";

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

interface PositionedNode extends Employee {
  x: number;
  y: number;
  width: number;
  height: number;
}

const OrgChartPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [nodes, setNodes] = useState<PositionedNode[]>([]);
  const [edges, setEdges] = useState<{ id: string; sections?: any[] }[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [bounds, setBounds] = useState({ minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 });

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then(setEmployees);
  }, []);

  // Compute layout with ELK
  useEffect(() => {
    if (employees.length === 0) return;

    const elk = new ELK();
    const nodeWidth = 220;
    const nodeHeight = 100;

    const graph = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": "DOWN",
        "elk.edgeRouting": "ORTHOGONAL",       // ensures edges have bends
        "elk.layered.spacing.nodeNodeBetweenLayers": "80",
        "elk.spacing.nodeNode": "40",
        "elk.portConstraints": "FIXED_ORDER",  // helps edge anchoring
        "elk.edgeLabels.inline": "true",       // optional, for better labels
      },
      children: employees.map((emp) => ({
        id: emp.id.toString(),
        width: nodeWidth,
        height: nodeHeight,
        emp,
      })),
      edges: employees
        .filter((emp) => emp.managerid)
        .map((emp) => ({
          id: `${emp.managerid}-${emp.id}`,
          sources: [emp.managerid!.toString()],
          targets: [emp.id.toString()],
        })),
    };

    elk.layout(graph).then((layout: any) => {
      console.log("ELK layout", layout);

      setNodes(
        (layout.children || []).map((n: any) => ({
          ...(n.emp as Employee),
          x: n.x,
          y: n.y,
          width: n.width,
          height: n.height,
        }))
      );
      setEdges(
        (layout.edges || []).map((edge: any) => ({
          id: edge.id,
          sections: (edge.sections || []).map((s: any) => ({
            startPoint: s.startPoint,
            endPoint: s.endPoint,
            bendPoints: s.bendPoints || [],
          })),
        }))
      );

      setBounds({minX: 0, minY: 0, maxX: layout.width, maxY: layout.height, width: layout.width, height: layout.height, });

      console.log("Edge[0] points:", layout.edges[0].sections[0].points);

    });
  }, [employees]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(
      amount
    );

  const handleDelete = async (id: number) => {
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  const handleZoom = (direction: "in" | "out" | "reset") => {
    if (direction === "in") setZoomLevel((z) => Math.min(z * 1.2, 3));
    if (direction === "out") setZoomLevel((z) => Math.max(z / 1.2, 0.5));
  };

  const handleReset = () => {
    setZoomLevel(1);
    if (bounds.width && bounds.height && chartRef.current) {
      const { clientWidth, clientHeight } = chartRef.current;
      setPan({
        x: clientWidth / 2 - bounds.width / 2,
        y: 50, // some padding from top
      });
    } else {
      setPan({ x: 0, y: 0 });
    }
  };


  // Panning handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setIsPanning(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseUp = () => setIsPanning(false);

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
            <button onClick={handleReset} className="btn btn-sm btn-secondary">
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Org Chart */}
        <div
          className="card"
          style={{ position: "relative", overflow: "hidden", minHeight: "600px", cursor: isPanning ? "grabbing" : "grab" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          ref={chartRef}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
              transformOrigin: "top left",
              position: "relative",
            }}
          >
            {/* Edges */}
            <svg
              style={{ position: "absolute", left: 0, top: 0 }}
              width={bounds.width}
              height={bounds.height}
              viewBox={`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`}
            >
              {edges.map((edge) =>
                (edge.sections || []).map((section, idx) => {
                  // Build array of all coordinates
                  const pts = [
                    section.startPoint,
                    ...(section.bendPoints || []),
                    section.endPoint,
                  ];
                  return (
                    <polyline
                      key={edge.id + idx}
                      points={pts.map((p: any) => `${p.x},${p.y}`).join(" ")}
                      fill="none"
                      stroke="#dd533bff"
                      strokeWidth={2}
                    />
                  );
                })
              )}
            </svg>


            {/* Nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className="org-node"
                style={{
                  position: "absolute",
                  left: node.x,
                  top: node.y,
                  width: node.width,
                  height: node.height,
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
                    <p>{node.employeenumber}</p>
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
                    onClick={() => alert("TODO: Edit modal")}
                    className="btn btn-sm btn-primary"
                  >
                    <Edit size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(node.id)}
                    className="btn btn-sm btn-danger"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrgChartPage;
