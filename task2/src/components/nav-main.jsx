import { IconCirclePlusFilled, IconMail, IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react"; // Import useContext
import { FormContext } from "@/components/data-table"; // Import FormContext
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({ items = [], setIsFormOpen }) {
  const navigate = useNavigate();

  const handleQuickCreate = () => {
    if (typeof setIsFormOpen === "function") {
      setIsFormOpen(true); // Open the Add Customer form
    } else {
      console.error("setIsFormOpen is not a function");
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              onClick={handleQuickCreate} // Trigger Add Customer form
              className="min-w-8 bg-white text-black duration-200 ease-linear hover:bg-gray-100 hover:text-black active:bg-gray-200 active:text-black"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => {
                  if (item.title === "Filter") handleFilterClick(); // Trigger filter popup
                  else if (item.title === "Dashboard") navigate("/dashboard"); // Correct path for Dashboard
                  else if (item.title === "Analytics") navigate("/dashboard/analytics"); // Correct path for Analytics
                }}
                className="nav-main-button min-w-8 bg-transparent text-sidebar-foreground duration-200 ease-linear hover:bg-gray-900"
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
