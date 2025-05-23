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
    const formattedRecord = {
      ...updatedRecord,
      Gender:
        updatedRecord.Gender === "Female"
          ? "F"
          : updatedRecord.Gender === "Male"
          ? "M"
          : updatedRecord.Gender,
    };

    const originalRecord = data.find((record) => record.ID === id);
    if (!originalRecord) return;

    const recordWithPreservedFields = {
      ...formattedRecord,
      ID: id,
      addedAt: originalRecord.addedAt,
    };

    const updatedData = data.map((record) =>
      record.ID === id ? recordWithPreservedFields : record
    );

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
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your data and insights.</p>
      </div>
      <SectionCards data={data} />
      <ChartAreaInteractive data={data} />
      <DataTable
        data={data}
        onAddRecord={onAddRecord}
        onEditRecord={handleEditRecord}
        onDeleteRecord={handleDeleteRecord}
        onDeleteSelectedRecords={handleDeleteSelectedRecords}
        onApplyFilter={onApplyFilter}
      />
    </div>
  );
}
