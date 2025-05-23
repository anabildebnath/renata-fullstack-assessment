"use client"

import { FormContext } from "@/components/data-table";
import { AuthContext } from "@/context/AuthContext"; // Add this import
import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FilterIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SettingsIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Filter",
      url: "#",
      icon: FilterIcon,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChartIcon,
    },
    {
      title: "Task1 Charts", // New button
      url: "https://renata-task1-charts.netlify.app/", // Updated URL
      icon: TrendingUpIcon,
    },
    {
      title: "Team",
      url: "#",
      icon: UsersIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
  ],
  documents: [
    {
      name: "Data Files",
      url: "#",
      icon: (props) => <FolderIcon {...props} className="h-4 w-4" />, // Make icon smaller
    },
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
}

export function AppSidebar({ setIsFormOpen, onApplyFilter, ...props }) {
  const { user: currentUser } = React.useContext(AuthContext); // Get current user from context

  const userData = {
    name: currentUser?.name || "Guest",
    email: currentUser?.email || "guest@example.com",
    avatar: currentUser?.avatar || "/avatars/default.jpg",
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="bg-[oklch(240%_5.3%_26.1%)] text-[oklch(var(--sidebar-foreground))]"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 text-[oklch(var(--sidebar-foreground))] hover:bg-[oklch(var(--sidebar-accent))] hover:text-[oklch(var(--sidebar-accent-foreground))] rounded-[var(--radius)]"
            >
              <a href="#" className="flex items-center gap-2">
                <img
                  src="../../public/logo.png"
                  alt="Renata Logo"
                  className="h-5 w-5"
                />
                <span className="text-base font-semibold">Renata PLC</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          setIsFormOpen={setIsFormOpen}
          onApplyFilter={onApplyFilter}
        />
        <NavDocuments items={data.documents} />
        <NavSecondary
          items={data.navSecondary}
          className="mt-auto text-[oklch(var(--sidebar-foreground))] hover:bg-[oklch(var(--sidebar-accent))] hover:text-[oklch(var(--sidebar-accent-foreground))]"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} /> {/* Pass the actual user data */}
      </SidebarFooter>
    </Sidebar>
  );
}
