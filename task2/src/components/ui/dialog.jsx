import * as React from "react";

export function Dialog({ open, onOpenChange, children }) {
  return open ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(var(--background))]/50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-[oklch(var(--card))] text-[oklch(var(--card-foreground))] rounded-[var(--radius)] shadow-lg p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  ) : null;
}

export function DialogContent({ children, className }) {
  return <div className={className}>{children}</div>;
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

export function DialogClose({ onClick }) {
  return (
    <button
      className="absolute top-2 right-2 text-[oklch(var(--muted-foreground))] hover:bg-[oklch(var(--muted))] hover:text-[oklch(var(--foreground))]"
      onClick={onClick}
    >
      Close
    </button>
  );
}
