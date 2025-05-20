import { IconCirclePlusFilled, IconMail, IconSearch } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react"; // Import useState and useContext
import { FormContext } from "@/components/data-table"; // Import FormContext
import { FilterPopup } from "@/components/filter-popup"; // Import FilterPopup
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({ items = [], setIsFormOpen, onApplyFilter }) {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Add filter state

  const handleQuickCreate = () => {
    if (typeof setIsFormOpen === "function") {
      setIsFormOpen(true); // Open the Add Customer form
    } else {
      console.error("setIsFormOpen is not a function");
    }
  };

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleApplyFilter = (filters) => {
    if (typeof onApplyFilter === "function") {
      onApplyFilter(filters); // Pass filters to parent component
    }
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    if (typeof onApplyFilter === "function") {
      onApplyFilter({
        CustomerName: "",
        Division: [],
        Gender: [],
        MaritalStatus: [],
        AgeRange: [0, 100],
        IncomeRange: [0, 100000],
      });
    }
    setIsFilterOpen(false);
  };

  const handleItemClick = (item) => {
    if (item.title === "Filter") handleFilterClick();
    else if (item.title === "Dashboard") navigate("/dashboard");
    else if (item.title === "Analytics") navigate("/dashboard/analytics");
    else if (item.title === "Task1 Charts") window.location.href = "/task1"; // Handle Task1 Charts click
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <SidebarMenuButton
                tooltip="Quick Create"
                onClick={handleQuickCreate}
                className="min-w-8 bg-white text-black duration-200 ease-linear hover:bg-gray-100 hover:text-black active:bg-gray-200 active:text-black [&>span]:text-black" // Added [&>span]:text-black
              >
                <IconCirclePlusFilled className="text-black" /> {/* Added text-black */}
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
                  onClick={() => handleItemClick(item)}
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

      {/* Add FilterPopup */}
      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilter={handleApplyFilter}
        onResetFilter={handleResetFilter}
      />
    </>
  );
}
