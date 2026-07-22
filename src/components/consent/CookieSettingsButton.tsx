"use client";

export function CookieSettingsButton() {
  return (
    <button className="linkButton" type="button" onClick={() => window.dispatchEvent(new CustomEvent("cartpaper:open-cookie-settings"))}>
      Setări cookie
    </button>
  );
}
