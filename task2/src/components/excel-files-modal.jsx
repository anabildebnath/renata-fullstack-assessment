import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileIcon } from "lucide-react";

export function ExcelFilesModal({ isOpen, onClose }) {
  // Get uploaded files from localStorage
  const getUploadedFiles = () => {
    const files = localStorage.getItem("uploadedFiles");
    return files ? JSON.parse(files) : [];
  };

  const files = getUploadedFiles();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Uploaded Excel Files</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {files.length > 0 ? (
            files.map((file, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-4 flex flex-col items-center hover:bg-accent/10 cursor-pointer"
              >
                <FileIcon className="w-8 h-8 mb-2 text-green-500" />
                <p className="text-sm font-medium text-center">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-8">
              No Excel files uploaded yet
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
