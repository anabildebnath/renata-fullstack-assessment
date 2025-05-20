import React from "react";
import { FileIcon } from "lucide-react";

export default function ExcelFilesPage() {
  const getUploadedFiles = () => {
    const files = localStorage.getItem("uploadedFiles");
    return files ? JSON.parse(files) : [];
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
            >
              <FileIcon className="w-12 h-12 mb-4 text-green-500" />
              <p className="text-lg font-medium text-center mb-2">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(file.uploadedAt).toLocaleDateString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {(file.size / 1024).toFixed(2)} KB
              </p>
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
