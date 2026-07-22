"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type PressableProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function Pressable({ children, className, ...props }: PressableProps) {
  return (
    <button className={clsx("pressable", className)} type="button" {...props}>
      {children}
    </button>
  );
}
