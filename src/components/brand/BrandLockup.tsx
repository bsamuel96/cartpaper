import Image from "next/image";
import clsx from "clsx";

type BrandLockupVariant = "light" | "dark" | "compact" | "footer";

type BrandLockupProps = {
  variant?: BrandLockupVariant;
  className?: string;
  priority?: boolean;
};

const markByVariant: Record<BrandLockupVariant, string> = {
  light: "/brand/cartpaper-mark-light.png",
  compact: "/brand/cartpaper-mark-light.png",
  dark: "/brand/cartpaper-mark-dark.png",
  footer: "/brand/cartpaper-mark-dark.png",
};

export function BrandLockup({ variant = "light", className, priority = false }: BrandLockupProps) {
  return (
    <span className={clsx("brandLockup", `brandLockup-${variant}`, className)} aria-label="Cartpaper.ro">
      <Image
        className="brandLockupMark"
        src={markByVariant[variant]}
        width={512}
        height={512}
        alt=""
        aria-hidden="true"
        priority={priority}
      />
      <span className="brandLockupText">cartpaper</span>
    </span>
  );
}
