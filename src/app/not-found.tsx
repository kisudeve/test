"use client";
import { House, ArrowLeft } from "lucide-react";
import top from "@/assets/notfound/404.svg";
import middle from "@/assets/notfound/404check.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function Notfound() {
  const router = useRouter();
  return (
    <>
      <div className="flex justify-center items-center flex-col h-screen h-full w-full">
        <Image src={top} alt="404에러" />
        <h1 className="font-bold mt-7 text-[32px] text-[#101828]">길 잃은 개미!</h1>
        <div className="mt-7 text-[18px] text-[#4A5565] flex flex-col justify-center items-center">
          <p>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
          <p>주소를 다시 확인하시거나 홈으로 돌아가세요</p>
        </div>
        <Image src={middle} alt="404확인" className="mt-5" />
        <div className="flex flex-row w-[600px] justify-between mt-5">
          <button
            onClick={() => router.push("/")}
            className="active:scale-[.99] transition-all duration-150 hover:scale-102 font-bold cursor-pointer gap-1 flex justify-center items-center text-[16px] text-white w-[292px] h-[56px] rounded-[12px] bg-gradient-to-b from-[#A8E0FF] to-[#C5C8FF] shadow-[0px_2px_4px_rgba(0,0,0,0.1),_0px_4px_6px_rgba(0,0,0,0.1)]"
          >
            <House color="white" size={18} />
            홈으로 돌아가기
          </button>
          <button
            onClick={() => router.back()}
            className="active:scale-[.99] transition-all duration-150 action hover:scale-102 font-bold cursor-pointer gap-1 flex justify-center items-center w-[292px] h-[60px] border-2 border-[#E5E7EB] rounded-[12px] text-[#364153] text-[16px]"
          >
            <ArrowLeft color="#364153" size={18} />
            이전 페이지
          </button>
        </div>
      </div>
    </>
  );
}
