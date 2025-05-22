import React, { useState, useEffect } from "react";
import { PlusIcon, DownloadIcon, EditIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ReportsPage() {
  const [reports, setReports] = useState(() => {
    const savedReports = localStorage.getItem("userReports");
    return savedReports ? JSON.parse(savedReports) : [];
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    localStorage.setItem("userReports", JSON.stringify(reports));
  }, [reports]);

  const handleCreateReport = (reportData) => {
    const newReport = {
      id: Date.now(),
      ...reportData,
      createdAt: new Date().toISOString(),
    };
    setReports([...reports, newReport]);
  };

  const handleDownloadReport = (report) => {
    // Generate report data based on report.criteria
    const reportData = "Report content...";
    
    // Create downloadable file
    const blob = new Blob([reportData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${report.name}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Manage and generate custom reports</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Create New Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{report.name}</h3>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleDownloadReport(report)}>
                  <DownloadIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setSelectedReport(report)}>
                  <EditIcon className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500">
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="text-sm">
              <p>Created: {new Date(report.createdAt).toLocaleDateString()}</p>
              <p>Type: {report.type}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Create/Edit Report Modal will be added here */}
    </div>
  );
}
