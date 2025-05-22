"use client";

import React, { useState, useContext } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";

export function NavSecondary({
  items = [],
  className,
  ...props
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [settings, setSettings] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    accountType: "Sales Representative", // Updated default value
  });
  const [error, setError] = useState("");

  const { user: currentUser } = useContext(AuthContext); // Get current user from context

  // Add useEffect to initialize settings with current user data
  React.useEffect(() => {
    if (currentUser) {
      setSettings(prev => ({
        ...prev,
        username: currentUser.name || "",
        accountType: currentUser.accountType || "Sales Representative",
      }));
    }
  }, [currentUser]);

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleSettingsSave = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      setError("No user session found");
      return;
    }

    // Password validation
    if (settings.newPassword || settings.confirmPassword) {
      if (settings.currentPassword !== currentUser.password) {
        setError("Current password is incorrect");
        return;
      }

      if (settings.newPassword !== settings.confirmPassword) {
        setError("New passwords do not match");
        return;
      }
    }

    // Update user data
    const updatedUsers = users.map(user => {
      if (user.email === currentUser.email) {
        return {
          ...user,
          name: settings.username || user.name,
          password: settings.newPassword || user.password,
          accountType: settings.accountType,
        };
      }
      return user;
    });

    // Save updated users
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // Update current user
    const updatedCurrentUser = {
      ...currentUser,
      name: settings.username || currentUser.name,
      password: settings.newPassword || currentUser.password,
      accountType: settings.accountType,
    };
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

    // Reset form fields
    setSettings({
      username: settings.username,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      accountType: settings.accountType,
    });

    // Show success message and close modal
    toast.success("Settings updated successfully! Changes will take effect on next login.");
    setIsSettingsOpen(false);

    // Force page refresh to reflect changes
    window.location.reload();
  };

  const handleClick = (itemTitle) => {
    if (itemTitle === "Settings") {
      handleSettingsClick();
    } else if (itemTitle === "Get Help") {
      window.open("https://www.linkedin.com/in/anabildebnath/", "_blank");
    }
  };

  const filteredItems = items.filter((item) => item.title !== "Search"); // Remove Search button

  return (
    <>
      <SidebarGroup {...props} className="mt-auto">
        <SidebarGroupContent>
          <SidebarMenu className={className}>
            {filteredItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={() => handleClick(item.title)}
                  className="nav-main-button"
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <div className="dialog-backdrop">
          <DialogContent className="popup-form">
            <DialogHeader>
              <DialogTitle>User Settings</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 mt-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              
              <div className="grid gap-2">
                <Label>Change Username</Label>
                <Input
                  value={settings.username}
                  onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                  placeholder="Enter new username"
                />
              </div>

              <div className="grid gap-2">
                <Label>Current Password</Label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={settings.currentPassword}
                    onChange={(e) => setSettings({ ...settings, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showCurrentPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>New Password</Label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={settings.newPassword}
                    onChange={(e) => setSettings({ ...settings, newPassword: e.target.value })}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showNewPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Confirm New Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={settings.confirmPassword}
                    onChange={(e) => setSettings({ ...settings, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Account Type</Label>
                <Select
                  value={settings.accountType}
                  onValueChange={(value) =>
                    setSettings({ ...settings, accountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                    <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                    <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSettingsSave}>Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </>
  );
}
