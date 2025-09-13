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
  email: string;
  manager?: { id: number; name: string; surname: string } | null;
};

export default function EmployeesPage() {
  const [data, setData] = useState<Employee[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/employees")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const columns: ColumnDef<Employee>[] = [
    {
      id: "avatar",
      header: "",
      cell: ({ row }) => (
        <div className="relative">
          <img
            src={getGravatarUrl(row.original.email, 40)}
            alt={`${row.original.name} ${row.original.surname}`}
            className="h-10 w-10 rounded-full border-2 border-white shadow-lg ring-2 ring-slate-100"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "First Name",
      cell: ({ row }) => (
        <div className="font-medium text-slate-900">
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "surname",
      header: "Last Name",
      cell: ({ row }) => (
        <div className="font-medium text-slate-900">
          {row.original.surname}
        </div>
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
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-slate-700 font-medium">{row.original.role}</span>
        </div>
      ),
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => {
        const salary = row.original.salary;
        const formatted = `R ${salary.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
        return (
          <div className="text-right">
            <div className="font-semibold text-slate-900">{formatted}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "manager",
      header: "Reports To",
      cell: ({ row }) => {
        const manager = row.original.manager;
        if (!manager) {
          return (
            <span className="text-slate-400 italic text-sm">No manager</span>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {manager.name.charAt(0)}
            </div>
            <span className="text-slate-700">
              {manager.name} {manager.surname}
            </span>
          </div>
        );
      },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </a>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Employee Directory</h1>
                <p className="text-slate-600 text-sm">Manage and explore your team</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">
                {data.length} employees
              </span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Add Employee
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Search and filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Search employees by name, role, or ID..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 h-11 bg-white/80 border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white/80 hover:bg-white transition-colors">
                Filter
              </button>
              <button className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white/80 hover:bg-white transition-colors">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-slate-50/80 border-b border-slate-200/50">
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className="cursor-pointer px-6 py-4 text-left font-semibold text-slate-700 hover:bg-slate-100/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <div className="text-slate-400">
                              {{
                                asc: (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                ),
                                desc: (
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                ),
                              }[header.column.getIsSorted() as string] ?? (
                                <svg className="w-4 h-4 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white/50">
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row, index) => (
                      <tr
                        key={row.id}
                        className={`border-b border-slate-100 hover:bg-blue-50/30 transition-colors ${
                          index % 2 === 0 ? 'bg-white/30' : 'bg-slate-50/30'
                        }`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-6 py-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="text-center px-6 py-12"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <div className="text-slate-500">
                            <p className="font-medium">No employees found</p>
                            <p className="text-sm">Try adjusting your search criteria</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats footer */}
        {!loading && data.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-slate-900">{data.length}</div>
                <div className="text-sm text-slate-600">Total Employees</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {new Set(data.map(emp => emp.role)).size}
                </div>
                <div className="text-sm text-slate-600">Unique Roles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  R {Math.round(data.reduce((sum, emp) => sum + emp.salary, 0) / data.length).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Avg Salary</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {data.filter(emp => emp.manager).length}
                </div>
                <div className="text-sm text-slate-600">With Managers</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}