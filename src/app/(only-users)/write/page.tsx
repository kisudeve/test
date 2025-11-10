import WriteDetail from "@/components/write/WriteDetail";
import { Suspense } from "react";

export default function WritePage() {
  return (
    <>
      <Suspense fallback={<div>로딩중 ...</div>}>
        <WriteDetail />
      </Suspense>
    </>
  );
}
