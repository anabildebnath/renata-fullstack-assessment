import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { LoginForm } from "@/components/login-form";

export default function Login() {
  const { login, user } = useContext(AuthContext); // Access the user state
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
    const { success, message } = login(email, password);
    if (success) {
      navigate("/dashboard", { replace: true }); // Redirect to dashboard on successful login
    } else {
      setError(message);
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
      />
    </div>
  );
}
