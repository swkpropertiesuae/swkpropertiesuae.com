import * as React from "react";
import { cn } from "@/lib/utils";

interface HalomotButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  gradient?: string;
  backgroundColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  outerBorderRadius?: string;
  innerBorderRadius?: string;
  fillWidth?: boolean;
  fixedWidth?: string;
  href?: string;
  inscription?: string;
}

/** Gradient-border button used by project-showcase-b (helper that the registry item imports). */
export function HalomotButton({
  gradient = "linear-gradient(to right, #e6cf9c, #c4a35a)",
  backgroundColor = "#0b0b0c",
  textColor = "#f4ecd8",
  hoverTextColor,
  outerBorderRadius = "999px",
  innerBorderRadius = "999px",
  fillWidth,
  fixedWidth,
  href,
  inscription,
  children,
  className,
  onClick,
  ...props
}: HalomotButtonProps) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (href) window.location.href = href;
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn("inline-block p-px transition-transform hover:scale-[1.03]", className)}
      style={{
        background: gradient,
        borderRadius: outerBorderRadius,
        width: fixedWidth ?? (fillWidth ? "100%" : undefined),
      }}
    >
      <span
        className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors"
        style={{
          background: backgroundColor,
          color: hover && hoverTextColor ? hoverTextColor : textColor,
          borderRadius: innerBorderRadius,
        }}
      >
        {children ?? inscription}
      </span>
    </button>
  );
}

export default HalomotButton;
