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

export function NavMain({ items = [], setIsFormOpen, onSearchClick }) { // Accept onSearchClick as a prop
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
              onClick={handleQuickCreate} // Trigger popup
              className="text-[oklch(var(--sidebar-foreground))] hover:bg-[oklch(var(--sidebar-accent))] hover:text-[oklch(var(--sidebar-accent-foreground))] rounded-[var(--radius)]"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
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
                className="text-[oklch(var(--sidebar-foreground))] hover:bg-[oklch(var(--sidebar-accent))] hover:text-[oklch(var(--sidebar-accent-foreground))] rounded-[var(--radius)]"
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
              className="text-[oklch(var(--sidebar-foreground))] hover:bg-[oklch(var(--sidebar-accent))] hover:text-[oklch(var(--sidebar-accent-foreground))] rounded-[var(--radius)]"
            >
              <IconSearch />
              <span>Search</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* End of Search button */}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
