import { IconCirclePlusFilled } from "@tabler/icons-react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react"; // Import useState
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
    if (item.title === "Filter") {
      handleFilterClick();
    }
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleQuickCreate}
                className="min-w-8 bg-white text-black duration-200 ease-linear hover:bg-gray-100 hover:text-black active:bg-gray-200 active:text-black [&>span]:text-black"
              >
                <IconCirclePlusFilled className="text-black" />
                <span>Quick Create</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  {item.title === "Filter" ? (
                    <button
                      onClick={() => handleItemClick(item)}
                      className="flex items-center gap-2 w-full nav-main-button min-w-8 bg-transparent text-sidebar-foreground duration-200 ease-linear hover:bg-gray-900"
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </button>
                  ) : (
                    <Link
                      to={item.url === "#" ? "/" : item.url}
                      className="flex items-center gap-2 w-full nav-main-button min-w-8 bg-transparent text-sidebar-foreground duration-200 ease-linear hover:bg-gray-900"
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  )}
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
