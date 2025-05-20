import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  onSubmit,
  error,
  email,
  setEmail,
  password,
  setPassword,
  isSignup = false,
  name,
  setName,
  ...props
}) {
  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-md", className)}
      {...props}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <form onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  {isSignup ? "Create an account" : "Welcome back"}
                </h1>
                <p className="text-muted-foreground">
                  {isSignup
                    ? "Sign up for an Acme Inc account"
                    : "Login to your Acme Inc account"}
                </p>
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              {isSignup && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {isSignup ? "Sign Up" : "Login"}
              </Button>
              <div className="text-center text-sm">
                {isSignup ? (
                  <>
                    Already have an account?{" "}
                    <a href="/login" className="underline">
                      Login
                    </a>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <a href="/signup" className="underline">
                      Sign up
                    </a>
                  </>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
