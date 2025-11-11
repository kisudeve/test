"use client";

import { useRouter } from "next/navigation";
import Button from "../common/Button";
import { createClient } from "@/utils/supabase/client";

export default function DeletePost({ postId }: { postId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const deleteHandler = async () => {
    await supabase.from("posts").delete().eq("id", postId);
    router.push("/community");
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold ">게시물 삭제</h3>
        <p className="text-slate-700">정말로 이 게시물을 삭제하시겠습니까?</p>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button
          variant="edit"
          className="w-20 h-10 bg-white border border-slate-200"
          onClick={() => {
            router.back();
          }}
        >
          취소
        </Button>
        <Button variant="delete" className="w-20 h-10 min-h-0 rounded-lg bg-slate-900" onClick={deleteHandler}>
          확인
        </Button>
      </div>
    </>
  );
}
