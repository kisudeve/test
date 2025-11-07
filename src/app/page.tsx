"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Lightbulb, TrendingUp, TrendingDown, Users } from "lucide-react";

// 차트 더미 데이터
const chartData = [
  { date: "Mon 15", day: 15, weekday: "Mon", up: 36, down: 20, hold: 0 },
  { date: "Tue 16", day: 16, weekday: "Tue", up: 110, down: 15, hold: 5 },
  { date: "Wed 17", day: 17, weekday: "Wed", up: 245, down: 11, hold: 0 },
  { date: "Thu 18", day: 18, weekday: "Thu", up: 170, down: 18, hold: 2 },
  { date: "Fri 19", day: 19, weekday: "Fri", up: 220, down: 10, hold: 0 },
  { date: "Sat 20", day: 20, weekday: "Sat", up: 87, down: 15, hold: 5 },
  { date: "Sun 21", day: 21, weekday: "Sun", up: 139, down: 12, hold: 3 },
  { date: "Mon 22", day: 22, weekday: "Mon", up: 201, down: 8, hold: 0 },
];

// 상승 주식 더미 데이터
const topRising = [
  { name: "#설렘", change: "+15.2%" },
  { name: "#설렘", change: "+15.2%" },
  { name: "#설렘", change: "+15.2%" },
];

// 상승 주식 더미 데이터
const topFalling = [
  { name: "#피곤", change: "+15.2%" },
  { name: "#슬픔", change: "+15.2%" },
  { name: "#분노", change: "+15.2%" },
];

// 커뮤니티 활동 더미 데이터
const communityStats = {
  newPosts: "1,204개",
  comments: "5,832개",
  currentUsers: "3,450명",
};

type Period = "1일" | "1주" | "1개월" | "All";

// 커스텀 툴팁 컴포넌트 (렌더링 외부로 이동)
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = chartData.find((d) => d.date === label);
    if (data) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl z-50">
          <p className="font-semibold text-sm mb-3 text-gray-800">
            2025-09-{String(data.day).padStart(2, "0")}
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-700 font-medium">UP {data.up}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-700 font-medium">DOWN {data.down}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
              <span className="text-sm text-gray-700 font-medium">HOLD {data.hold}</span>
            </div>
          </div>
        </div>
      );
    }
  }
  return null;
};

// 커스텀 X축 틱 컴포넌트 (2줄 표시)
interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

const CustomTick = ({ x = 0, y = 0, payload }: CustomTickProps) => {
  if (!payload) return null;

  const data = chartData.find((d) => d.date === payload.value);

  // 시작점에서는 아무것도 표시하지 않음
  if (payload.value === chartData[0].date) {
    return null;
  }

  if (data) {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#6b7280" fontSize={12}>
          <tspan x={0} dy="0">
            {data.weekday}
          </tspan>
          <tspan x={0} dy="14">
            {data.day}
          </tspan>
        </text>
      </g>
    );
  }

  return null;
};

export default function Page() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("1주");
  const [hoveredDate, setHoveredDate] = useState<string | null>("Wed 17");

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 상단 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          {/* 인사말 */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">안녕하세요, OOO님</h1>

          {/* 차트 섹션 */}
          <div className="w-full">
            {/* 필터와 범례를 같은 라인에 배치 */}
            <div className="flex items-center justify-between mb-4">
              {/* 기간 선택 버튼 */}
              <div className="flex flex-wrap gap-2">
                {(["1일", "1주", "1개월", "All"] as Period[]).map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedPeriod === period
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {period}
                    {period === "All" && <span className="ml-1">📊</span>}
                  </button>
                ))}
              </div>
              {/* 범례 */}
              <div className="flex gap-4 pr-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm text-gray-600 font-medium">UP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600 font-medium">DOWN</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-black"></div>
                  <span className="text-sm text-gray-600 font-medium">HOLD</span>
                </div>
              </div>
            </div>

            {/* 차트 */}
            <div className="w-full h-64 md:h-80 lg:h-96 bg-white rounded-lg">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
                  onMouseMove={(e) => {
                    if (e?.activeLabel) {
                      setHoveredDate(e.activeLabel);
                    }
                  }}
                  onMouseLeave={() => setHoveredDate(null)}
                >
                  <defs>
                    <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    horizontal={true}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#6b7280"
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={{ stroke: "#e5e7eb" }}
                    tick={<CustomTick />}
                  />
                  {/* 일자별 경계선 */}
                  {chartData.map((item, index) => {
                    // 첫 번째는 시작점이므로 경계선 표시 안 함
                    if (index === 0) return null;
                    return (
                      <ReferenceLine
                        key={`border-${index}`}
                        x={item.date}
                        stroke="#e5e7eb"
                        strokeWidth={1}
                      />
                    );
                  })}
                  <YAxis
                    domain={[50, 300]}
                    ticks={[50, 100, 150, 200, 250, 300]}
                    stroke="#6b7280"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    axisLine={{ stroke: "#e5e7eb" }}
                    tickLine={{ stroke: "#e5e7eb" }}
                    width={40}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {hoveredDate && (
                    <ReferenceLine
                      x={hoveredDate}
                      stroke="#9ca3af"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                    />
                  )}
                  <Area type="monotone" dataKey="up" stroke="none" fill="url(#colorUp)" />
                  <Line
                    type="monotone"
                    dataKey="up"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ fill: "#3b82f6", r: 0, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 시장 요약 카드 */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                  오늘의 감정 시장지수 요약
                </h2>
                <p className="text-gray-600 text-sm md:text-base">
                  개미들은 오늘 소폭 상승장을 경험하고 있습니다. 긍정적인 신호가 많네요!
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">최근 업데이트</p>
              <p className="text-sm font-medium text-gray-700">2025년 10월 30일 오전 12:50</p>
            </div>
          </div>
        </div>

        {/* 하단 3개 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* 상승 주식 TOP 3 */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">상승 주식 TOP 3</h3>
            </div>
            <ul className="space-y-3">
              {topRising.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                >
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-green-600 font-semibold">{item.change}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 하락 주식 TOP 3 */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-bold text-gray-800">하락 주식 TOP 3</h3>
            </div>
            <ul className="space-y-3">
              {topFalling.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                >
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-red-600 font-semibold">{item.change}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 커뮤니티 활동 */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">커뮤니티 활동</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-gray-700">새로운 글</span>
                <span className="text-gray-800 font-semibold">{communityStats.newPosts}</span>
              </li>
              <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-gray-700">댓글</span>
                <span className="text-gray-800 font-semibold">{communityStats.comments}</span>
              </li>
              <li className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                <span className="text-gray-700">현재 접속자</span>
                <span className="text-gray-800 font-semibold">{communityStats.currentUsers}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
