"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";
import SearchTabs from "@/components/search/SearchTabs";
import SearchPostItem from "@/components/search/SearchPostItem";
import SearchUserItem from "@/components/search/SearchUserItem";
import SearchTagItem from "@/components/search/SearchTagItem";

import { fetchPostsWithLikes } from "@/features/search/api/fetchPosts";
import { fetchUsers } from "@/features/search/api/fetchUsers";
import { fetchTags } from "@/features/search/api/fetchTags";
import { mapRowToCommunityPost } from "@/features/search/mappers/post.mapper";
import { mapRowToSearchUser } from "@/features/search/mappers/user.mapper";
import { mapRowToSearchTag } from "@/features/search/mappers/tag.mapper";

import type { Tab } from "@/components/search/SearchTabs";
import { createClient } from "@/utils/supabase/client";

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

  const [showAllUsers, setShowAllUsers] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);

  // 데이터 최초 로드 (병렬)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const supabase = createClient();

        // 1) 현재 로그인한 유저 가져오기
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("[search] getUser error", userError);
        }

        const userId = user?.id ?? null;

        // 2) posts + likes + users + tags 병렬 로드
        const [{ posts: rawPosts, likes }, u, t] = await Promise.all([
          fetchPostsWithLikes(),
          fetchUsers(),
          fetchTags(),
        ]);

        // 3) mapper에서 likes + userId를 이용해
        //    likes_count / is_liked_by_me 계산해서 CommunityPost로 변환
        setPosts(rawPosts.map((row) => mapRowToCommunityPost(row, likes, userId)));
        setUsers(u.map(mapRowToSearchUser));
        setTags(t.map(mapRowToSearchTag));
      } catch (e) {
        if (e instanceof Error) {
          setErr(e.message ?? "알 수 없는 오류");
        } else {
          setErr("알 수 없는 오류");
        }
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
    <section className="flex flex-col gap-6">
      <div className="rounded-2xl bg-white border border-slate-200 shadow-[0_4px_16px_rgba(15,23,42,0.06)] px-6 py-5 flex flex-col gap-4">
        <SearchBar value={input} onChange={setInput} onSubmit={onSubmit} />
        <SearchTabs active={active} counts={counts} onChange={onChangeTab} />
      </div>

      {loading && <p className="text-slate-400">불러오는 중…</p>}
      {err && <p className="text-red-500">오류: {err}</p>}

      {!loading && !err && (
        <div className="flex flex-col gap-6">
          {/* 전체(all) 탭일 때: 3개 섹션 모두 표시 */}
          {active === "all" && (
            <>
              {/* 사용자 섹션 */}
              {filteredUsers.length > 0 && (
                <section className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-700 font-semibold">사용자</h3>
                    {filteredUsers.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllUsers((prev) => !prev)}
                        className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        {showAllUsers ? "접기" : "더보기"}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    {(showAllUsers ? filteredUsers : filteredUsers.slice(0, 3)).map((user) => (
                      <SearchUserItem key={user.id} user={user} />
                    ))}
                  </div>
                </section>
              )}

              {/* 태그 섹션 */}
              {filteredTags.length > 0 && (
                <section className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-700 font-semibold">태그</h3>
                    {filteredTags.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllTags((prev) => !prev)}
                        className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        {showAllTags ? "접기" : "더보기"}
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {(showAllTags ? filteredTags : filteredTags.slice(0, 3)).map((tag) => (
                      <SearchTagItem key={tag.content} tag={tag} />
                    ))}
                  </div>
                </section>
              )}

              {/* 게시글 섹션 */}
              {filteredPosts.length > 0 && (
                <section className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-700 font-semibold">게시글</h3>
                    {filteredPosts.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowAllPosts((prev) => !prev)}
                        className="text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        {showAllPosts ? "접기" : "더보기"}
                      </button>
                    )}
                  </div>
                  <div className="flex flex-col gap-4">
                    {(showAllPosts ? filteredPosts : filteredPosts.slice(0, 3)).map((post) => (
                      <SearchPostItem key={post.id} post={post} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* 단일 탭일 때 */}
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
