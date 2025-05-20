import React, { useState } from "react";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive"; // Import the chart component
import { DataTable } from "@/components/data-table";

export default function Dashboard({ data, onUpdateData }) {
  const handleAddRecord = (newRecord) => {
    const updatedData = [...data, newRecord];
    onUpdateData(updatedData);
  };

  const handleEditRecord = (id, updatedRecord) => {
    const updatedData = data.map((record) =>
      record.ID === id ? updatedRecord : record
    );
    onUpdateData(updatedData);
  };

  const handleDeleteRecord = (id) => {
    const updatedData = data.filter((record) => record.ID !== id);
    onUpdateData(updatedData);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Overview of your data and insights.</p>
      <SectionCards data={data} />
      <ChartAreaInteractive data={data} /> {/* Add the chart component here */}
      <DataTable
        data={data} // Pass filtered data to DataTable
        onAddRecord={handleAddRecord}
        onEditRecord={handleEditRecord}
        onDeleteRecord={handleDeleteRecord}
      />
    </div>
  );
}
