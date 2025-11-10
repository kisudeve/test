"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";
import SearchTabs from "@/components/search/SearchTabs";
import SearchPostItem from "@/components/search/SearchPostItem";
import { MOCK_POSTS } from "@/components/search/mockPosts";

export default function Page() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("query") || "").trim().toLowerCase();
  const [input, setInput] = useState(q);

  const filtered = useMemo(() => {
    if (!q) return MOCK_POSTS;
    return MOCK_POSTS.filter((p) => {
      const hay = [p.title, p.content, p.users.display_name, ...(p.tags ?? []).map((t) => `#${t}`)]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [q]);

  return (
    <section className="max-w-5xl mx-auto p-6 flex flex-col gap-6">
      <SearchBar
        value={input}
        onChange={setInput}
        onSubmit={() => {
          const url = input ? `/search?query=${encodeURIComponent(input)}` : "/search";
          window.history.replaceState(null, "", url);
        }}
      />

      <SearchTabs postCount={filtered.length} userCount={0} tagCount={0} />

      <div className="flex flex-col gap-4">
        {filtered.map((post) => (
          <SearchPostItem key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
