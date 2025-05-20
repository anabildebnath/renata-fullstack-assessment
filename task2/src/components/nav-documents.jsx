"use client"

import { IconDots, IconFolder, IconShare3, IconTrash } from "@tabler/icons-react";
import React from "react";
import { useNavigate } from "react-router-dom";

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

export function NavDocuments({
  items
}) {
  const { isMobile } = useSidebar()
  const [isExcelFilesOpen, setIsExcelFilesOpen] = React.useState(false);
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
    }
    // ...handle other items...
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden documents-section">
        <SidebarGroupLabel>Documents</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                onClick={() => handleItemClick(item.name)}
                asChild={item.name !== "Data Files"}
                className={`${item.name === "Data Files" ? "border-none !bg-transparent" : ""}`}
              >
                {item.name === "Data Files" ? (
                  <button className="flex items-center gap-2 w-full border-none bg-transparent">
                    <item.icon />
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <a href={item.url} className="flex items-center gap-2">
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                )}
              </SidebarMenuButton>
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
    </>
  );
}
