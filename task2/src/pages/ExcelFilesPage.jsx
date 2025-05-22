import React from "react";
import { FileIcon, DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExcelFilesPage() {
  const getUploadedFiles = () => {
    const files = localStorage.getItem("uploadedFiles");
    return files ? JSON.parse(files) : [];
  };

  const handleDownload = (file) => {
    const allData = JSON.parse(localStorage.getItem("data")) || [];
    const headers = ["ID,CustomerName,Division,Gender,MaritalStatus,Age,Income,addedAt\n"];
    const csvData = allData.map(row => 
      `${row.ID},${row.CustomerName},${row.Division},${row.Gender},${row.MaritalStatus},${row.Age},${row.Income},${row.addedAt}`
    ).join("\n");
    const csvContent = headers + csvData;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const files = getUploadedFiles();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Uploaded Excel Files</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {files.length > 0 ? (
          files.map((file, index) => (
            <div
              key={index}
              className="border border-border rounded-lg p-6 flex flex-col items-center hover:bg-accent/10 cursor-pointer"
              onClick={() => handleDownload(file)}
            >
              <FileIcon className="w-12 h-12 mb-4 text-green-500" />
              <p className="text-lg font-medium text-center mb-2">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(file.uploadedAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(file);
                }}
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground py-12">
            <p className="text-lg">No Excel files uploaded yet</p>
            <p className="text-sm mt-2">Upload files through the Import button in the dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
}
