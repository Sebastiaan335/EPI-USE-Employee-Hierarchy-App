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
import { Input } from "@/components/ui/input"; // or replace with a plain <input>
import { getGravatarUrl } from "../../../lib/gravatar";

type Employee = {
  id: number;
  name: string;
  surname: string;
  email: string;
  birthDate: string;
  employeeNumber: string;
  salary: number;
  role: string;
  manager?: { id: number; name: string; surname: string } | null;
};

export default function EmployeesPage() {
  const [data, setData] = useState<Employee[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    fetch("/api/employees")
      .then((r) => r.json())
      .then((json) => setData(json));
  }, []);

  const filteredData = useMemo(() => {
    const q = globalFilter.trim().toLowerCase();
    if (!q) return data;
    return data.filter((e) =>
      [
        e.name,
        e.surname,
        e.email,
        e.employeeNumber,
        e.role,
        String(e.salary),
        e.manager ? `${e.manager.name} ${e.manager.surname}` : "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [data, globalFilter]);

  const columns: ColumnDef<Employee>[] = [
    {
      id: "avatar",
      header: "",
      cell: ({ row }) => (
        <img
          src={getGravatarUrl(row.original.email, 36)}
          alt={`${row.original.name} ${row.original.surname}`}
          className="h-9 w-9 rounded-full border"
        />
      ),
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "surname", header: "Surname" },
    { accessorKey: "employeeNumber", header: "Employee #" },
    { accessorKey: "role", header: "Role" },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: (info) => `R ${info.getValue<number>().toFixed(2)}`,
    },
    {
      id: "manager",
      header: "Manager",
      cell: ({ row }) =>
        row.original.manager
          ? `${row.original.manager.name} ${row.original.manager.surname}`
          : "—",
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Employees</h1>

      <Input
        placeholder="Search employees…"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className="cursor-pointer px-4 py-2 text-left font-medium select-none"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[h.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="even:bg-gray-50 hover:bg-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-8 text-center text-gray-500" colSpan={columns.length}>
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
