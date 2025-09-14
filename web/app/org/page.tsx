"use client";

import React from "react";
import OrgChart from "../../components/ui/Org";

export default function OrgPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Organisational Chart</h1>
      <OrgChart />
    </div>
  );
}
