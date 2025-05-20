import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Update localStorage when user state changes
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [user]);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = users.find((u) => u.email === email);

    if (!existingUser) {
      return { success: false, message: "No user found. Please sign up." };
    }

    if (existingUser.password !== password) {
      return { success: false, message: "Wrong credentials were provided." };
    }

    setUser(existingUser); // Set the authenticated user
    return { success: true };
  };

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const newUser = { name, email, password };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setUser(newUser); // Automatically log in the user
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
