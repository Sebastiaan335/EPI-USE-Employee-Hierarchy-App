"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "../../components/ui/input";
import { getGravatarUrl } from "../../lib/gravatar";

type Employee = {
  id: number;
  name: string;
  surname: string;
  birthDate: string;
  employeeNumber: string;
  salary: number;
  role: string;
  email: string; // 👈 ensure your DB has this field
  manager?: { id: number; name: string; surname: string } | null;
};

export default function EmployeesPage() {
  const [data, setData] = useState<Employee[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    fetch("/api/employees")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  const columns: ColumnDef<Employee>[] = [
    {
      id: "avatar",
      header: "",
      cell: ({ row }) => (
        <img
          src={getGravatarUrl(row.original.email, 40)}
          alt={`${row.original.name} ${row.original.surname}`}
          className="h-10 w-10 rounded-full border shadow-sm"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "surname",
      header: "Surname",
    },
    {
      accessorKey: "employeeNumber",
      header: "Employee #",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: (info) => `R ${info.getValue<number>().toFixed(2)}`,
    },
    {
      accessorKey: "manager",
      header: "Manager",
      cell: (info) =>
        info.row.original.manager
          ? `${info.row.original.manager.name} ${info.row.original.manager.surname}`
          : "—",
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Employees</h1>

      {/* Global Search */}
      <Input
        placeholder="Search employees..."
        value={globalFilter ?? ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer px-4 py-2 text-left font-medium"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="even:bg-gray-50 hover:bg-gray-100 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center px-4 py-6 text-gray-500"
                >
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
