import { ButtonProps } from "@/types/form";
import { twMerge } from "tailwind-merge";

export default function Button(props: ButtonProps) {
  const { className = "", onClick, children, init = false, ...rest } = props;
  return (
    <>
      <button
        className={twMerge(
          className,
          init &&
            "min-h-12 flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#A8E0FF] to-[#C5C8FF] text-white px-4 py-4 font-semibold text-sm hover:opacity-90 active:scale-[.99] transition",
        )}
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    </>
  );
}
