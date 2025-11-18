import { emotionToColor, emotionToStroke, EmotionType } from "@/utils/helpers/emotionData";

/**
 * 감정에 따른 배경색 클래스를 반환합니다.
 * @param emotion - 감정 키워드
 * @returns TailwindCSS 배경색 클래스
 */
export function getEmotionColor(emotion: EmotionType): string {
  return emotionToColor[emotion] || "bg-gray-100";
}

/**
 * 감정에 따른 텍스트/아이콘 색상 클래스를 반환합니다.
 * @param emotion - 감정 키워드
 * @returns TailwindCSS 텍스트 색상 클래스
 */
export function getEmotionStroke(emotion: EmotionType): string {
  return emotionToStroke[emotion] || "text-gray-500";
}

/**
 * 감정이 긍정적인지 판단합니다.
 * @param emotion - 감정 키워드
 * @returns 긍정적 감정 여부
 */
export function isPositiveEmotion(emotion: EmotionType): boolean {
  const positiveEmotions = [
    "기쁨",
    "설렘",
    "감사",
    "만족",
    "통쾌",
    "안도",
    "자신감",
    "편안",
    "감탄",
    "열정",
  ];
  return positiveEmotions.includes(emotion);
}

/**
 * 감정이 부정적인지 판단합니다.
 * @param emotion - 감정 키워드
 * @returns 부정적 감정 여부
 */
export function isNegativeEmotion(emotion: EmotionType): boolean {
  const negativeEmotions = [
    "슬픔",
    "불안",
    "짜증",
    "두려움",
    "질투",
    "혐오",
    "고통",
    "실망",
    "피로",
    "우울",
  ];
  return negativeEmotions.includes(emotion);
}

/**
 * 감정 카테고리를 반환합니다.
 * @param emotion - 감정 키워드
 * @returns 감정 카테고리 ('positive' | 'negative' | 'neutral')
 */
export function getEmotionCategory(emotion: EmotionType): "positive" | "negative" | "neutral" {
  if (isPositiveEmotion(emotion)) return "positive";
  if (isNegativeEmotion(emotion)) return "negative";
  return "neutral";
}
