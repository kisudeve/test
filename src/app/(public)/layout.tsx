import Header from "@/components/common/Header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="py-6 pl-4 w-[18%] min-w-[180px] shrink-0 sticky top-0 h-screen overflow-y-auto overflow-x-hidden">
        <Header />
      </div>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}

export const metadata = {
  title: "Public",
};
