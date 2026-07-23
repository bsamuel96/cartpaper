"use client";

import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import type { QuoteDialogDetail } from "@/components/quote/QuoteDialog";

type QuoteButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    quoteDetail?: QuoteDialogDetail;
  }
>;

export function QuoteButton({ children, onClick, quoteDetail, ...props }: QuoteButtonProps) {
  return (
    <button
      type="button"
      {...props}
      onClick={(event) => {
        onClick?.(event);
        window.dispatchEvent(new CustomEvent("cartpaper:open-quote", { detail: quoteDetail }));
      }}
    >
      {children}
    </button>
  );
}
