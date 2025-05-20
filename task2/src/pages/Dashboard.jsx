import React from "react";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";

export default function Dashboard({
  data,
  onDeleteRecord,
  onDeleteSelectedRecords,
  onAddRecord,
  onApplyFilter,
}) {
  const handleAddRecord = (newRecord) => {
    if (typeof onAddRecord === "function") {
      onAddRecord(newRecord);
    }
  };

  const handleEditRecord = (id, updatedRecord) => {
    // Create a new array with the updated record
    const updatedData = data.map((record) =>
      record.ID === id ? { ...record, ...updatedRecord } : record
    );

    // Use onAddRecord to update the state in the parent component
    if (typeof onAddRecord === "function") {
      onAddRecord(updatedData);
    }
  };

  const handleDeleteRecord = (id) => {
    if (typeof onDeleteRecord === "function") {
      onDeleteRecord(id);
    }
  };

  const handleDeleteSelectedRecords = (selectedIds) => {
    if (typeof onDeleteSelectedRecords === "function") {
      onDeleteSelectedRecords(selectedIds);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Overview of your data and insights.</p>
      <SectionCards data={data} />
      <ChartAreaInteractive data={data} />
      <DataTable
        data={data}
        onAddRecord={handleAddRecord}
        onEditRecord={handleEditRecord}
        onDeleteRecord={onDeleteRecord}
        onDeleteSelectedRecords={onDeleteSelectedRecords}
      />
    </div>
  );
}
