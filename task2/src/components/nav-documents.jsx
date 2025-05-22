"use client"

import { IconDots, IconFolder, IconShare3, IconTrash } from "@tabler/icons-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ExcelFilesModal } from "@/components/excel-files-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function NavDocuments({
  items = []
}) {
  const { isMobile } = useSidebar()
  const [isExcelFilesOpen, setIsExcelFilesOpen] = React.useState(false);
  const [isDataLibraryOpen, setIsDataLibraryOpen] = useState(false);
  const navigate = useNavigate();

  const handleWordAssistantRedirect = () => {
    // Redirect to Gemini
    window.location.href = "https://gemini.example.com";
  };

  const handleMorePopup = () => {
    // Show a popup for "More"
    alert("More: Added later based on new requirements.");
  };

  const handleItemClick = (itemName) => {
    if (itemName === "Data Files") {
      navigate("/excel-files");
    } else if (itemName === "Data Library") {
      setIsDataLibraryOpen(true);
    } else if (itemName === "Reports") {
      navigate("/reports");
    }
  };

  const handleDialogClose = () => {
    setIsDataLibraryOpen(false);
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden documents-section">
        <SidebarGroupLabel>Documents</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <div className="w-full">
                <Link
                  to={item.url}
                  className="flex items-center gap-2 w-full p-2 hover:bg-[hsl(215,27.9%,16.9%)] rounded-md transition-colors"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover className="data-[state=open]:bg-accent rounded-sm">
                    <IconDots />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-24 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}>
                  <DropdownMenuItem>
                    <IconFolder />
                    <span>Open</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconShare3 />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <IconTrash />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleMorePopup}
              className="text-sidebar-foreground/70"
            >
              <IconDots className="text-sidebar-foreground/70" />
              <span>More</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <ExcelFilesModal 
        isOpen={isExcelFilesOpen} 
        onClose={() => setIsExcelFilesOpen(false)} 
      />

      <Dialog 
        modal={false} // Allow clicking outside to close
        open={isDataLibraryOpen} 
        onOpenChange={handleDialogClose}
      >
        <div 
          className="dialog-backdrop"
          onClick={handleDialogClose} // Close when clicking the backdrop
        >
          <DialogContent 
            className="popup-form" 
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the content
            style={{
              width: '800px',
              minHeight: '200px',
              backgroundColor: '#0a0a0a',
              border: '#252525 solid 0.2px',
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.8)',
              padding: '4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center px-32">
              <p className="text-xl font-light text-white text-center whitespace-normal">
                Due to constraints of time, this feature would be implemented based on further requirements.
              </p>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
