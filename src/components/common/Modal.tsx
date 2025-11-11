"use client";

import { useRouter } from "next/navigation";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const closeModal = () => {
    router.back();
  };

  return (
    <>
      <div
        className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.3)] z-40 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="min-w-100 p-6 rounded-lg bg-white border border-slate-200 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </>
  );
}
