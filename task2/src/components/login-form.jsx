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
    <form
      className={cn(
        "mx-auto flex w-full max-w-md flex-col gap-6 rounded-xl bg-card p-8 shadow-lg border border-border",
        className
      )}
      {...props}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          {isSignup ? "Create an account" : "Login to your account"}
        </h1>
        <p className="text-balance text-sm text-muted-foreground">
          {isSignup
            ? "Sign up for an Acme Inc account"
            : "Enter your email below to login to your account"}
        </p>
      </div>
      <div className="grid gap-6">
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
              className="rounded-md border border-border bg-background px-3 py-2 text-base"
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
            className="rounded-md border border-border bg-background px-3 py-2 text-base"
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {!isSignup && (
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline text-white"
              >
                Forgot your password?
              </a>
            )}
          </div>
          <Input
            id="password"
            type="password"
            placeholder={isSignup ? "Create a password" : "Enter your password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-md border border-border bg-background px-3 py-2 text-base"
          />
        </div>
        <Button type="submit" className="w-full rounded-md text-base font-semibold bg-[#18181B] hover:bg-neutral-900 text-white">
          {isSignup ? "Sign Up" : "Login"}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="w-full flex items-center justify-center gap-2 rounded-md border border-border bg-background text-base font-medium hover:bg-muted">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              fill="currentColor"
            />
          </svg>
          {isSignup ? "Sign up with GitHub" : "Login with GitHub"}
        </Button>
      </div>
      <div className="text-center text-sm mt-2">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <a href="/login" className="underline underline-offset-4 text-primary">
              Login
            </a>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <a href="/signup" className="underline underline-offset-4 text-primary">
              Sign up
            </a>
          </>
        )}
      </div>
    </form>
  );
}
