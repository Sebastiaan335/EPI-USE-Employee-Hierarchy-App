// ===============================
// Organization Chart Page
// ===============================

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

// Types
type ApiEmployee = {
  id: number;
  name: string;
  surname: string;
  role: string;
  managerId: number | null;
  email?: string;
};

type Employee = ApiEmployee;

const nodeWidth = 300;
const nodeHeight = 140;

// Custom node
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
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"
      />
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 w-full h-full transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 group-hover:border-blue-300">
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${bgColor} rounded-t-2xl`}
        />
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
                {subordinateCount} report
                {subordinateCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(level + 1, 5) }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${bgColor}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Level {level + 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};