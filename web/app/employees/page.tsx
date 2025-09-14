// ==================================
// Employees Page
// ==================================
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { getGravatarUrl } from "../../lib/gravatar";

type Employee = {
  id: number;
  name: string;
  surname: string;
  birthDate: string;
  employeeNumber: string;
  salary: number;
  role: string;
  email?: string;
  manager?: { id: number; name: string; surname: string } | null;
};

export default function EmployeesPage() {
  const [data, setData] = useState<Employee[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [newEmp, setNewEmp] = useState<Partial<Employee>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employees");
      const json = await res.json();
      setData(json);
    } catch (e) {
      // noop
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const columns: ColumnDef<Employee>[] = [
    {
      id: "avatar",
      header: "",
      cell: ({ row }) => (
        <div className="relative">
          <img
            src={getGravatarUrl(
              row.original.email ||
                `${row.original.name}.${row.original.surname}@example.com`,
              40
            )}
            alt={`${row.original.name} ${row.original.surname}`}
            className="h-10 w-10 rounded-full border-2 border-white shadow-lg ring-2 ring-slate-100"
          />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "First Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "surname",
      header: "Last Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.surname}</div>
      ),
    },
    {
      accessorKey: "employeeNumber",
      header: "Employee ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm bg-slate-100 text-slate-700 px-2 py-1 rounded-md inline-block">
          {row.original.employeeNumber}
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Position",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          <span className="text-slate-700 font-medium">
            {row.original.role}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "salary",
      header: "Salary",
    },
  ];
}