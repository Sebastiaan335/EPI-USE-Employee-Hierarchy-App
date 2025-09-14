"use client";

import React, { useEffect, useState } from "react";
import OrgChart, { Employee } from "../../components/ui/Org";

export default function OrgPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await fetch("/api/employees", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch employees");
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEmployees();
  }, []);

  const handleUpdateEmployee = async (id: string, update: Partial<Employee>) => {
    await fetch(`/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    // Refresh data
    const res = await fetch("/api/employees", { cache: "no-store" });
    setEmployees(await res.json());
  };

  const handleDeleteEmployee = async (id: string) => {
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    // Refresh data
    const res = await fetch("/api/employees", { cache: "no-store" });
    setEmployees(await res.json());
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading organisation chart…</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Organisational Chart</h1>
      <OrgChart
        employees={employees}
        onUpdateEmployee={handleUpdateEmployee}
        onDeleteEmployee={handleDeleteEmployee}
      />
    </div>
  );
}
