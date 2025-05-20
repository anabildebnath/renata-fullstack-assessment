import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { LoginForm } from "@/components/login-form";

export default function Signup() {
  const { signup, user } = useContext(AuthContext); // Access the user state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true }); // Redirect authenticated users to the dashboard
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && password) {
      signup(name, email, password); // Save user data
      navigate("/dashboard"); // Redirect to dashboard
    } else {
      setError("All fields are required");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <LoginForm
        onSubmit={handleSubmit}
        error={error}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isSignup
        name={name}
        setName={setName}
      />
    </div>
  );
}
