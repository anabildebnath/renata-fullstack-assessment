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

export function NavMain({ items = [], setIsFormOpen, onSearchClick }) {
  const navigate = useNavigate();

  const handleQuickCreate = () => {
    if (typeof setIsFormOpen === "function") {
      setIsFormOpen(true); // Open the popup
    } else {
      console.error("setIsFormOpen is not a function");
    }
  };

  const handleSearchClick = () => {
    if (typeof onSearchClick === "function") {
      onSearchClick(); // Trigger focus on search box
    } else {
      console.error("onSearchClick is not a function");
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              onClick={handleQuickCreate} // Trigger popup
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
                  if (item.title === "Dashboard") navigate("/dashboard");
                  else if (item.title === "Filter Search") alert("Filter Search: Page opened.");
                  else if (item.title === "Analytics") navigate("/analytics");
                  else if (item.title === "Projects" || item.title === "Team") alert(`${item.title}: Placeholder.`);
                }}
                className="nav-main-button min-w-8 bg-transparent text-sidebar-foreground duration-200 ease-linear hover:bg-gray-900"
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {/* Add Search button */}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Search"
              onClick={handleSearchClick} // Trigger onSearchClick prop
              className="min-w-8 bg-transparent text-sidebar-foreground duration-200 ease-linear hover:bg-gray-200 hover:text-black active:bg-gray-300 active:text-black"
            >
              <IconSearch />
              <span>Search</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
