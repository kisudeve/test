"use client";

import { useState } from "react";
import PostTabs from "./PostTabs";
import PostList from "./PostList";
import type { PostWithTags } from "../page";

export default function ProfilePosts({
  written,
  viewed,
}: {
  written: PostWithTags[];
  viewed: PostWithTags[];
}) {
  const [active, setActive] = useState<"posts" | "views">("posts");

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-5">
        <PostTabs
          active={active}
          onChange={setActive}
          postsCount={written.length}
          viewsCount={viewed.length}
        />
      </div>

      {active === "posts" ? (
        <PostList posts={written} hideTitle />
      ) : (
        <PostList posts={viewed} hideTitle />
      )}
    </section>
  );
}
