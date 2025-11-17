// 감정별 아이콘 매핑 데이터 (모든 아이콘은 lucide-react에서 실제 존재하는 것들)
export const emotionToIconName: Record<string, string> = {
  // 긍정
  기쁨: "smile",
  설렘: "heart",
  감사: "heart",
  만족: "thumbs-up",
  통쾌: "trophy",
  안도: "sun",
  자신감: "shield",
  편안: "home",
  감탄: "sparkles",
  열정: "flame",
  // 부정
  슬픔: "cloud-rain",
  불안: "alert-triangle",
  짜증: "frown",
  두려움: "skull",
  질투: "eye",
  혐오: "x",
  고통: "zap",
  실망: "thumbs-down",
  피로: "battery-low",
  우울: "cloud-rain",
  // 무난
  심심: "clock",
  담담: "coffee",
  체념: "circle",
  무던: "wheat",
  평이: "minus",
  망설임: "help-circle",
  방관: "eye-off",
  조용: "volume-x",
  미지근: "droplets",
  중립: "meh",
};

// 감정별 배경색 매핑 데이터
export const emotionToColor: Record<string, string> = {
  // 긍정 - 밝고 따뜻한 색상
  기쁨: "bg-yellow-100",
  설렘: "bg-pink-100",
  감사: "bg-rose-100",
  만족: "bg-green-100",
  통쾌: "bg-purple-100",
  안도: "bg-orange-100",
  자신감: "bg-blue-100",
  편안: "bg-emerald-100",
  감탄: "bg-amber-100",
  열정: "bg-red-100",
  // 부정 - 차분하고 어두운 색상
  슬픔: "bg-blue-200",
  불안: "bg-yellow-200",
  짜증: "bg-red-200",
  두려움: "bg-gray-200",
  질투: "bg-green-200",
  혐오: "bg-red-300",
  고통: "bg-orange-200",
  실망: "bg-slate-200",
  피로: "bg-stone-200",
  우울: "bg-indigo-200",
  // 무난 - 중성적인 색상
  심심: "bg-gray-100",
  담담: "bg-neutral-100",
  체념: "bg-slate-100",
  무던: "bg-stone-100",
  평이: "bg-zinc-100",
  망설임: "bg-amber-50",
  방관: "bg-gray-50",
  조용: "bg-slate-50",
  미지근: "bg-blue-50",
  중립: "bg-neutral-50",
};

// 감정별 텍스트/아이콘 색상 매핑 데이터
export const emotionToStroke: Record<string, string> = {
  // 긍정 - 밝고 따뜻한 색상
  기쁨: "text-yellow-500",
  설렘: "text-pink-500",
  감사: "text-rose-500",
  만족: "text-green-500",
  통쾌: "text-purple-500",
  안도: "text-orange-500",
  자신감: "text-blue-500",
  편안: "text-emerald-500",
  감탄: "text-amber-500",
  열정: "text-red-500",
  // 부정 - 차분하고 어두운 색상
  슬픔: "text-blue-600",
  불안: "text-yellow-600",
  짜증: "text-red-600",
  두려움: "text-gray-600",
  질투: "text-green-600",
  혐오: "text-red-700",
  고통: "text-orange-600",
  실망: "text-slate-600",
  피로: "text-stone-600",
  우울: "text-indigo-600",
  // 무난 - 중성적인 색상
  심심: "text-gray-500",
  담담: "text-neutral-500",
  체념: "text-slate-500",
  무던: "text-stone-500",
  평이: "text-zinc-500",
  망설임: "text-amber-500",
  방관: "text-gray-500",
  조용: "text-slate-500",
  미지근: "text-blue-500",
  중립: "text-neutral-500",
};

// 타입 정의
export type EmotionType = keyof typeof emotionToIconName;
