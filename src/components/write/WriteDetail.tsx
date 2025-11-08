"use client";
import Image from "next/image";
import UP from "@/assets/write/up.svg";
import DOWN from "@/assets/write/down.svg";
import HOLD from "@/assets/write/hold.svg";
import uploadPicture from "@/assets/write/uploadPicture.svg";
import { up, down, hold } from "./hashtags";
import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";

// 감정 버튼 설정
const emotions = [
  { key: "up", label: "UP", color: "#FF6467", bg: "#FFF5F5", img: UP },
  { key: "down", label: "DOWN", color: "#51A2FF", bg: "#F2F8FF", img: DOWN },
  { key: "hold", label: "HOLD", color: "#99A1AF", bg: "#F6F6F7", img: HOLD },
] as const;

export default function WriteDetail() {
  const [pick, setPick] = useState<"up" | "down" | "hold" | "">("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState([4]); // 현재 단계 (0~9)
  const totalSteps = 10;

  // pick에 따라 hashtag 배열 가져오기
  const hashtags = pick === "up" ? up : pick === "down" ? down : pick === "hold" ? hold : [];

  // 해시태그 클릭 시 토글 동작
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };
  return (
    <div className="flex justify-center items-center flex-col w-[1440px] h-[960px] bg-amber-300">
      <div className="flex items-center flex-col w-[752px] h-[928px] rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white">
        <p className="pt-7 text-[24px] text-[#1A2035]">오늘의 감정 기록</p>

        {/* 감정 선택 영역 */}
        <div className="flex justify-start items-center flex-col text-base">
          <p className="text-[#4B5563] mr-auto ml-1 pb-4 mt-7">오늘의 감정은 어떠신가요?</p>

          <div className="flex justify-between items-center w-[700px] text-base">
            {emotions.map((e) => (
              <button
                key={e.key}
                onClick={() => {
                  setPick(e.key);
                  setSelectedTags([]);
                }}
                className={`flex justify-center items-center flex-col w-[216px] h-[91px] rounded-xl cursor-pointer transition-transform duration-200 transform hover:scale-102 
                  ${
                    pick === e.key
                      ? `border-2 border-[${e.color}] bg-[${e.bg}]`
                      : "border border-[#E5E7EB] hover:bg-[#E5E7EB]"
                  }`}
              >
                <Image src={e.img} alt={e.label} />
                <span style={{ color: e.color }}>{e.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 해시태그 영역 */}
        <div>
          {pick ? (
            <div className="relative w-[688px] flex justify-center mt-10 mb-3">
              {/* 숫자 말풍선 */}
              <div
                className={` absolute -top-9 flex justify-center items-center w-7 h-7 ${pick === "up" ? "bg-[#FF6467]" : pick === "down" ? "bg-[#51A2FF]" : pick === "hold" ? "bg-[#99A1AF]" : ""} text-white text-sm rounded-full shadow-md transition-all duration-100`}
                style={{
                  left: `${(sliderValue[0] / (totalSteps - 1)) * 100}%`,
                  transform: "translateX(-50%)", // ✅ 손잡이 중앙 정렬
                }}
              >
                {sliderValue[0] + 1}
              </div>
              {/* 슬라이더 */}
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={sliderValue}
                onValueChange={setSliderValue}
                max={totalSteps - 1}
                step={1}
              >
                {/* 트랙 */}
                <Slider.Track className="bg-gray-200 relative flex-grow rounded-full h-2">
                  <Slider.Range
                    className={`absolute ${pick === "up" ? "bg-[#FF6467]" : pick === "down" ? "bg-[#51A2FF]" : pick === "hold" ? "bg-[#99A1AF]" : ""} rounded-full h-full`}
                  />
                </Slider.Track>

                {/* 작은 점들 */}
                {[...Array(totalSteps)].map((_, i) => (
                  <div
                    key={i}
                    className={`border absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
                      i <= sliderValue[0]
                        ? pick === "up"
                          ? "border-[#FF6467]"
                          : pick === "down"
                            ? "border-[#51A2FF]"
                            : pick === "hold"
                              ? "border-[#99A1AF]"
                              : ""
                        : "border-gray-300"
                    } ${i <= sliderValue[0] ? `bg-white ` : "bg-gray-300"}`}
                    style={{
                      left: `${(i / (totalSteps - 1)) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  />
                ))}

                {/* 손잡이 */}
                <Slider.Thumb
                  className={`relative z-10 block w-5 h-5 border-[3px] ${pick === "up" ? "border-[#FF6467]" : pick === "down" ? "border-[#51A2FF]" : pick === "hold" ? "border-[#99A1AF]" : ""} cursor-pointer bg-white rounded-full shadow-md hover:scale-110 transition-transform outline-none`}
                  style={{
                    left: `${(sliderValue[0] / (totalSteps - 1)) * 100}%`,
                    transform: "translateX(-50%)", // ✅ 손잡이 중앙 정렬
                  }}
                  aria-label="Emotion level"
                />
              </Slider.Root>
            </div>
          ) : (
            ""
          )}
          <div className=" w-[688px] flex flex-row justify-between text-[#4A5565]">
            {hashtags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`cursor-pointer w-[53px] h-7 text-[12px] border rounded-[9999px] transition-colors duration-150 
                  ${
                    selectedTags.includes(tag)
                      ? pick === "up"
                        ? "bg-[#FF6467] text-white border-[#FF6467]"
                        : pick === "down"
                          ? "bg-[#51A2FF] text-white border-[#51A2FF]"
                          : "bg-[#99A1AF] text-white border-[#99A1AF]"
                      : "border-[#E5E7EB] text-[#4A5565] hover:text-black hover:bg-black/5"
                  }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* 메모 */}
        <textarea
          className="bg-[#F9FAFB] border rounded-xl border-[#E5E7EB] w-[688px] h-[340px] mt-7 resize-none outline-none focus:scale-102 transform transition-transform duration-200"
          placeholder="오늘의 메모를 남겨보세요..."
        ></textarea>

        <Image
          src={uploadPicture}
          alt="uploadPicture"
          className="mt-7 cursor-pointer hover:scale-102 transform transition-transform duration-200"
        />

        <button className="mt-7 flex justify-center items-center text-[#ffffff] w-[688px] h-[42px] shadow-[0_2px_4px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] rounded-xl bg-linear-to-r from-[#A8E0FF] to-[#C5C8FF] cursor-pointer hover:scale-102 transform transition-transform duration-200">
          기록 완료
        </button>
      </div>
    </div>
  );
}
