"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type QuoteButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function QuoteButton({ children, onClick, ...props }: QuoteButtonProps) {
  return (
    <button
      type="button"
      {...props}
      onClick={(event) => {
        onClick?.(event);
        window.dispatchEvent(new CustomEvent("cartpaper:open-quote"));
      }}
    >
      {children}
    </button>
  );
}
