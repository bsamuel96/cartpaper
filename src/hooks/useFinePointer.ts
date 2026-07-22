"use client";

import { useEffect, useState } from "react";

export function useFinePointer() {
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (hover: hover)");
    const sync = () => setFinePointer(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return finePointer;
}
