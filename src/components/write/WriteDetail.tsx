"use client";
import Image from "next/image";
import UP from "@/assets/write/up.svg";
import DOWN from "@/assets/write/down.svg";
import HOLD from "@/assets/write/hold.svg";
import uploadPicture from "@/assets/write/uploadPicture.svg";
import { up, down, hold } from "./hashtags";
import { useEffect, useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import closeButton from "@/assets/write/closeButton.svg";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { badWords } from "./badWords";

// 감정 버튼 설정
const emotions = [
  { key: "up", label: "UP", color: "#FF6467", bg: "#FFF5F5", img: UP },
  { key: "down", label: "DOWN", color: "#51A2FF", bg: "#F2F8FF", img: DOWN },
  { key: "hold", label: "HOLD", color: "#99A1AF", bg: "#F6F6F7", img: HOLD },
] as const;

export default function WriteDetail() {
  const searchParams = useSearchParams();
  const pageId = searchParams.get("post_id"); // 1
  const supabase = createClient();
  const router = useRouter();

  const imageUploadInput = useRef<HTMLInputElement>(null);

  const [hasBadTitle, setHasBadTitle] = useState(false);
  const [hasBadContent, setHasBadContent] = useState(false);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [imageUploadPreview, setImageUploadPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [pick, setPick] = useState<"up" | "down" | "hold" | "">("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState([4]); // 현재 단계 (0~9)
  const totalSteps = 10;

  // 의미 있는 특수문자들
  const escapeRegex = (src: string) => {
    return src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValueTitle = e.target.value;

    if (inputValueTitle.length <= 40) setTitle(inputValueTitle);

    // 욕설
    const hasBad = badWords.some((word) => {
      const safeWord = escapeRegex(word);
      const regex = new RegExp(safeWord, "i");
      return regex.test(inputValueTitle); // ← 최신 입력값으로 검사
    });

    setHasBadTitle(hasBad);
  };

  const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValueTitle = e.target.value;

    if (inputValueTitle.length <= 500) setContent(inputValueTitle);

    // 욕설
    const hasBad = badWords.some((word) => {
      const safeWord = escapeRegex(word);
      const regex = new RegExp(safeWord, "i");
      return regex.test(inputValueTitle); // ← 최신 입력값으로 검사
    });

    setHasBadContent(hasBad);
  };

  // pick에 따라 hashtag 배열 가져오기
  const hashtags = pick === "up" ? up : pick === "down" ? down : pick === "hold" ? hold : [];

  // 해시태그 클릭 시 토글 동작
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const imageUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) return;

    if (file) {
      const imagePreviewUrl = URL.createObjectURL(file);
      setImageUploadPreview(imagePreviewUrl);
      setImageUpload(file);
    }
  };

  const handlePublish = async () => {
    if (hasBadContent || hasBadTitle) {
      alert("적절하지 못한 내용을 포함하고 있습니다.");
      return;
    }
    if (pick === "") {
      alert("감정을 선택해주세요.");
      return;
    }

    if (title.trim() === "") {
      alert("제목을 입력해주세요.");
      return;
    }

    if (content.trim() === "") {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("로그인이 필요합니다.");
        return;
      }

      let imageUrl = null;
      if (imageUpload) {
        const filePath = `user-${user.id}/${Date.now()}-${imageUpload.name}`;

        const { error: uploadError } = await supabase.storage
          .from("post_image")
          .upload(filePath, imageUpload);

        if (uploadError) {
          console.error("Image upload failed:", uploadError.message);
          alert("이미지 업로드 중 오류가 발생했습니다.");
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("post_image").getPublicUrl(filePath);

        imageUrl = publicUrl;
      }
      if (!pageId) {
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .insert([
            {
              user_id: user.id,
              title,
              content,
              image_url: imageUrl,
            },
          ])
          .select("id")
          .single();

        if (postError) throw postError;

        const postId = postData.id;

        let insertAmount = 0;
        if (pick === "down") insertAmount = (sliderValue[0] + 1) * -1;
        else if (pick === "hold") insertAmount = 0;
        else insertAmount = sliderValue[0] + 1;

        const { error: feelError } = await supabase.from("feels").insert([
          {
            post_id: postId,
            type: pick,
            amount: insertAmount,
            user_id: user.id,
          },
        ]);

        if (feelError) throw feelError;

        const tagString = selectedTags.join(",");
        const { error: tagError } = await supabase
          .from("hashtags")
          .insert([{ post_id: postId, content: tagString }]);

        if (tagError) throw tagError;

        alert("글이 성공적으로 등록되었습니다!");
        router.push("/community");
      } else {
        let insertImage = null;
        if (!imageUpload) insertImage = existingImage;
        else insertImage = imageUrl;
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .update({
            user_id: user.id,
            title,
            content,
            image_url: insertImage,
          })
          .eq("id", pageId)
          .eq("user_id", user.id)
          .select("id")
          .single();

        if (postError) throw postError;

        const postId = postData.id;

        let insertAmount = 0;
        if (pick === "down") insertAmount = (sliderValue[0] + 1) * -1;
        else if (pick === "hold") insertAmount = 0;
        else insertAmount = sliderValue[0] + 1;

        const { error: feelError } = await supabase
          .from("feels")
          .update({
            post_id: postId,
            type: pick,
            amount: insertAmount,
            user_id: user.id,
          })
          .eq("post_id", pageId)
          .eq("user_id", user.id);

        if (feelError) throw feelError;

        const tagString = selectedTags.join(",");
        const { error: tagError } = await supabase
          .from("hashtags")
          .update({ post_id: postId, content: tagString })
          .eq("post_id", pageId);

        if (tagError) throw tagError;

        alert("글이 성공적으로 수정되었습니다!");
        router.push(`/community/${pageId}`);
      }
    } catch (e) {
      console.error(e);
      alert("글 작성 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (!pageId) return;
    (async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!user || userError) {
        alert("로그인 후 수정이 가능합니다.");
        router.replace("/auth/sign-in");
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select(
          `
    id,
    title,
    content,
    user_id,
    image_url,
    hashtags(*),
    feels(*)
    `,
        )
        .eq("id", pageId)
        .eq("user_id", user?.id ?? "")
        .single();

      if (!data || error) {
        alert("내 게시글만 수정 가능합니다.");
        router.replace("/");
        return;
      }

      const feels = data.feels[0];
      const hashtags = data.hashtags[0];

      setImageUploadPreview(data.image_url);
      setExistingImage(data.image_url);
      setTitle(data.title ?? "");
      setContent(data.content ?? "");
      setPick(feels.type);
      if (feels.type === "down") {
        setSliderValue([(feels.amount + 1) * -1]);
      } else if (feels.type === "hold") {
        setSliderValue([4]);
      } else {
        setSliderValue([feels.amount - 1]);
      }

      if (Array.isArray(hashtags.content)) {
        setSelectedTags(hashtags.content);
      } else if (typeof hashtags.content === "string") {
        setSelectedTags(
          hashtags.content
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t !== ""),
        );
      }
    })();
  }, [pageId, router, supabase]);
  return (
    <div className="flex justify center items-center flex-col w-[752px] h-full rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] bg-white">
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

      <div
        className={`transition-all duration-200 ${
          pick ? "translate-y-11 opacity-100" : "translate-y-0 opacity-0"
        }`}
      >
        {pick ? (
          <div className="relative w-[688px] flex justify-center mb-3">
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
              <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
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
        {/* 해시태그 영역 */}
        <div className=" w-[688px] flex flex-row justify-between text-[#4A5565] mb-10">
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

      {/* 제목 */}
      <div className="relative">
        <input
          className=" bg-[#F9FAFB] border rounded-xl border-[#E5E7EB] w-[688px] h-14 mt-7 resize-none outline-none focus:scale-102 transform transition-transform duration-200"
          placeholder="오늘의 메모를 남겨보세요..."
          value={title}
          onChange={handleChangeTitle}
        />
        <span className="absolute bottom-2 right-4 font-normal text-[#AAAAAA] text-[14px]">
          {title.length} / 40
        </span>
        {hasBadTitle ? (
          <p className="mt-0.5 ml-2 absolute text-[#c85c5c]">적절하지 못한 제목입니다</p>
        ) : (
          ""
        )}
      </div>

      {/* 메모 */}
      <div className="relative">
        <textarea
          className=" bg-[#F9FAFB] border rounded-xl border-[#E5E7EB] w-[688px] h-[340px] mt-12 resize-none outline-none focus:scale-102 transform transition-transform duration-200"
          placeholder="오늘의 메모를 남겨보세요..."
          value={content}
          onChange={handleChangeContent}
        />
        <span className="absolute bottom-2 right-4 font-normal text-[#AAAAAA] text-[14px]">
          {content.length} / 500
        </span>
        {hasBadContent ? (
          <p className="absolute ml-2 text-[#c85c5c]">적절하지 못한 내용입니다</p>
        ) : (
          ""
        )}
      </div>

      {/* 업로드된 이미지 */}
      <input
        type="file"
        className="hidden"
        ref={imageUploadInput}
        accept="image/*"
        onChange={(e) => {
          imageUploadHandler(e);
        }}
      />
      <div className="relative group/image mt-10 w-[700px] h-[115px] rounded-2xl flex justify-center items-center">
        <Image
          src={imageUploadPreview || uploadPicture}
          alt="업로드 이미지"
          width={688}
          height={108}
          className={`w-[688px] h-[108px] object-cover rounded-2xl hover:scale-102 transition-all duration-200
      ${imageUploadPreview ? "hover:brightness-60 cursor-default" : "cursor-pointer"}
    `}
          onClick={() => {
            if (!imageUploadPreview) imageUploadInput.current?.click();
          }}
        />
        {/* hover 시 나타나는 X버튼 */}
        {imageUploadPreview && (
          <div
            className={`
        opacity-0 group-hover/image:opacity-100 transition-opacity duration-200
        absolute inset-0 flex justify-center items-center pointer-events-none
      `}
          >
            <button
              type="button"
              className="pointer-events-auto cursor-pointer close-btn hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                setImageUploadPreview(null);
                setImageUpload(null);
              }}
            >
              <Image src={closeButton} alt="이미지 삭제" width={36} height={36} draggable={false} />
            </button>
          </div>
        )}
      </div>
      <button
        className="mt-7 flex justify-center items-center text-[#ffffff] w-[688px] h-[42px] shadow-[0_2px_4px_rgba(0,0,0,0.1),0_4px_6px_rgba(0,0,0,0.1)] rounded-xl bg-linear-to-r from-[#A8E0FF] to-[#C5C8FF] cursor-pointer hover:scale-102 transform transition-transform duration-200"
        onClick={handlePublish}
      >
        기록 완료
      </button>
    </div>
  );
}
