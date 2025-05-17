"use client";
import * as React from "react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}) {
  const handleSettingsPopup = () => {
    // Show a popup for editing profile details
    alert("Settings: Edit profile details.");
  };

  const handleGetHelpPopup = () => {
    // Show a popup with contact mediums
    alert("Get Help: Contact mediums displayed.");
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                onClick={() => {
                  if (item.title === "Settings") handleSettingsPopup();
                  else if (item.title === "Get Help") handleGetHelpPopup();
                }}
              >
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
