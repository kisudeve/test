"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";
import SearchTabs from "@/components/search/SearchTabs";
import SearchPostItem from "@/components/search/SearchPostItem";
import SearchUserItem from "@/components/search/SearchUserItem";
import SearchTagItem from "@/components/search/SearchTagItem";

import { fetchPosts } from "@/features/search/api/fetchPosts";
import { fetchUsers } from "@/features/search/api/fetchUsers";
import { fetchTags } from "@/features/search/api/fetchTags";
import { mapRowToCommunityPost } from "@/features/search/mappers/post.mapper";
import { mapRowToSearchUser } from "@/features/search/mappers/user.mapper";
import { mapRowToSearchTag } from "@/features/search/mappers/tag.mapper";

type Tab = "posts" | "users" | "tags";

export default function Page() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("query") || "").trim();
  const initialTab = (searchParams.get("type") as Tab) || "posts";

  const [input, setInput] = useState(q);
  const [active, setActive] = useState<Tab>(initialTab);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [posts, setPosts] = useState<ReturnType<typeof mapRowToCommunityPost>[]>([]);
  const [users, setUsers] = useState<ReturnType<typeof mapRowToSearchUser>[]>([]);
  const [tags, setTags] = useState<ReturnType<typeof mapRowToSearchTag>[]>([]);

  // 데이터 최초 로드 (병렬)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const [p, u, t] = await Promise.all([fetchPosts(), fetchUsers(), fetchTags()]);
        setPosts(p.map(mapRowToCommunityPost));
        setUsers(u.map(mapRowToSearchUser));
        setTags(t.map(mapRowToSearchTag));
      } catch (e: any) {
        setErr(e?.message ?? "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // URL 동기화
  const updateUrl = (nextQ: string, nextTab: Tab) => {
    const url =
      `/search${nextQ || nextTab !== "posts" ? "?" : ""}` +
      [nextQ && `query=${encodeURIComponent(nextQ)}`, nextTab !== "posts" && `type=${nextTab}`]
        .filter(Boolean)
        .join("&");
    window.history.replaceState(null, "", url);
  };

  // 검색 제출
  const onSubmit = () => updateUrl(input, active);
  // 탭 변경
  const onChangeTab = (t: Tab) => {
    setActive(t);
    updateUrl(input, t);
  };

  const needle = q.toLowerCase();

  const filteredPosts = useMemo(() => {
    if (!needle) return posts;
    return posts.filter((p) => {
      const hay = [
        p.title,
        p.content,
        p.users?.display_name ?? "",
        ...(p.tags ?? []).map((t) => `#${t}`),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [needle, posts]);

  const filteredUsers = useMemo(() => {
    if (!needle) return users;
    return users.filter((u) =>
      [u.display_name, u.bio ?? ""].join(" ").toLowerCase().includes(needle),
    );
  }, [needle, users]);

  const filteredTags = useMemo(() => {
    if (!needle) return tags;
    return tags.filter((t) => t.content.toLowerCase().includes(needle));
  }, [needle, tags]);

  const counts = {
    posts: filteredPosts.length,
    users: filteredUsers.length,
    tags: filteredTags.length,
  };

  return (
    <section className="mx-auto p-6 flex flex-col gap-6">
      <SearchBar value={input} onChange={setInput} onSubmit={onSubmit} />

      <SearchTabs active={active} counts={counts} onChange={onChangeTab} />

      {loading && <p className="text-slate-400">불러오는 중…</p>}
      {err && <p className="text-red-500">오류: {err}</p>}

      {!loading && !err && (
        <div className="flex flex-col gap-4">
          {active === "posts" &&
            filteredPosts.map((post) => <SearchPostItem key={post.id} post={post} />)}

          {active === "users" &&
            filteredUsers.map((user) => <SearchUserItem key={user.id} user={user} />)}

          {active === "tags" &&
            filteredTags.map((tag) => <SearchTagItem key={tag.content} tag={tag} />)}
        </div>
      )}
    </section>
  );
}
