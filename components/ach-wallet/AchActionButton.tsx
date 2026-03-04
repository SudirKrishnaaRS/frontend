import { ButtonHTMLAttributes, ReactNode } from "react";

type AchActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  leadingIcon?: ReactNode;
};

export default function AchActionButton({
  variant = "primary",
  // leadingIcon,
  className = "",
  children,
  ...props
}: AchActionButtonProps) {
  const baseClassName =
    "inline-flex w-full items-center justify-center gap-2 border font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#152644]/40 disabled:cursor-not-allowed disabled:opacity-100";

  const variantClassName =
    variant === "primary"
      ? "h-12 rounded-[30px] border-[#152644] bg-[#152644] px-4 py-2 text-[18px] leading-[1.2] text-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] disabled:border-[#cccccc] disabled:bg-[#e6e6e6] disabled:text-[#808080] lg:h-9 lg:px-3 lg:py-2 lg:text-sm"
      : "h-9 rounded-[30px] border-[#a6a6a6] bg-white px-3 py-2 text-sm leading-[1.2] text-[#161d25] shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:bg-[#f8fafc]";

  return (
    <button
      className={`${baseClassName} ${variantClassName} ${className}`.trim()}
      type="button"
      {...props}
    >
      {/* {leadingIcon} */}
      <span>{children}</span>
    </button>
  );
}
