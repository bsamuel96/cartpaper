"use client";

let gsapPromise: Promise<typeof import("gsap").gsap> | null = null;

export function getGsap() {
  if (!gsapPromise) {
    gsapPromise = import("gsap").then((module) => module.gsap);
  }

  return gsapPromise;
}
