"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandLockup } from "@/components/brand/BrandLockup";
import { navItems } from "@/content/siteContent";

export function MobileMenu({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (event.key === "Tab" && panelRef.current) {
        const focusables = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a, button"));
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        ref={triggerRef}
        className="iconButton mobileOnly"
        type="button"
        aria-label="Deschide meniul"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" size={24} />
      </button>

      {open ? (
        <div className="mobileMenuLayer" role="presentation" onMouseDown={closeMenu}>
          <div
            ref={panelRef}
            className="mobileMenuPanel"
            role="dialog"
            aria-modal="true"
            aria-label="Meniu principal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="mobileMenuTop">
              <BrandLockup variant={variant} />
              <button className="iconButton" type="button" aria-label="Închide meniul" onClick={closeMenu}>
                <X aria-hidden="true" size={24} />
              </button>
            </div>
            <nav className="mobileMenuNav" aria-label="Navigare mobilă">
              {navItems.map((item) => (
                <Link href={item.href} key={item.href} onClick={closeMenu}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <button
              className="button buttonPrimary"
              type="button"
              onClick={() => {
                closeMenu();
                window.dispatchEvent(new CustomEvent("cartpaper:open-quote"));
              }}
            >
              Cere ofertă
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
