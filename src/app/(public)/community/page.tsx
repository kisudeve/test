import { formatRelativeTime } from "@/utils/helpers";
import { createClient } from "@/utils/supabase/server";
import { Heart, MessageCircle, Minus, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";

export default async function Page() {
  const supabase = await createClient();
  const { data: posts, error: listError } = await supabase
    .from("posts")
    .select("*, users(display_name, image_url), feels(type)")
    .order("created_at", { ascending: false });
  if (listError || !posts) {
    return null;
  }

  return (
    <>
      <section className="flex flex-col gap-4 m-8">
        {posts.map((post) => (
          <article
            key={post.id}
            className="p-5 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white"
          >
            <div className="flex gap-4 pb-5">
              {/* 사용자 프로필 사진 */}
              <div className="w-12 h-12">
                <Image
                  src={post.users.image_url || ""}
                  width={48}
                  height={48}
                  alt={`${post.users.display_name}님의 프로필 이미지`}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                {/* 사용자 닉네임, 작성시간, 글 타입 */}
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center gap-4">
                    <strong className="font-medium text-slate-800">
                      {post.users.display_name}
                    </strong>
                    <span className="text-slate-400">{formatRelativeTime(post.created_at)}</span>
                  </div>
                  {post.feels[0].type === "up" && (
                    <div className="flex justify-center items-center gap-1 px-3 py-1 bg-red-200 font-medium text-red-500 rounded-2xl">
                      <TrendingUp size={20} />
                      <span>UP</span>
                    </div>
                  )}
                  {post.feels[0].type === "down" && (
                    <div className="flex justify-center items-center gap-1 px-3 py-1 bg-blue-200 font-medium text-blue-500 rounded-2xl">
                      <TrendingDown size={20} />
                      <span>DOWN</span>
                    </div>
                  )}
                  {post.feels[0].type === "hold" && (
                    <div className="flex justify-center items-center gap-1 px-3 py-1 bg-slate-200 font-medium text-slate-500 rounded-2xl">
                      <Minus size={20} />
                      <span>HOLD</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold">{post.title}</h3>
                  <p className="line-clamp-1 font-medium text-slate-700">{post.content}</p>
                </div>
                <div>
                  <span className="px-2 py-1 rounded-2xl bg-slate-200 text-xs text-slate-600">
                    #해시
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-5 border-t border-slate-200 pt-5">
              <button className="flex items-center gap-1 font-medium text-sm text-slate-400 cursor-pointer">
                <Heart size={18} className="stroke-slate-200 fill-slate-200" />
                {post.likes_count}
              </button>
              <button className="flex items-center gap-1 font-medium text-sm text-slate-400 cursor-pointer">
                <MessageCircle size={16} className="stroke-slate-200 fill-slate-200" />
                {post.comments_count}
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
