"use client";

import { useMemo, useState } from "react";
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
import type { ChartDataPoint } from "@/components/dashboard/model/dashboard";

type Period = "1일" | "1주" | "1개월" | "All";

interface DashboardChartProps {
  chartData: ChartDataPoint[];
}

// 커스텀 툴팁 컴포넌트
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string | number;
}

const formatKoreanDate = (isoString: string) => {
  const date = new Date(isoString);
  const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}`;
};

const CustomTooltip = ({
  active,
  payload,
  label,
  chartData,
}: CustomTooltipProps & { chartData: ProcessedPoint[] }) => {
  if (active && payload && payload.length) {
    const index = typeof label === "number" ? Math.round(label) : NaN;
    const data =
      Number.isFinite(index) && index >= 0 && index < chartData.length
        ? chartData[index]
        : chartData.find((d) => d.date === label);
    if (data) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl z-50">
          <p className="font-semibold text-sm mb-3 text-gray-800">{formatKoreanDate(data.date)}</p>
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
    value: number;
  };
}

type ProcessedPoint = ChartDataPoint & { index: number };

const CustomTick = ({
  x = 0,
  y = 0,
  payload,
  chartData,
}: CustomTickProps & { chartData: ProcessedPoint[] }) => {
  if (!payload || chartData.length === 0) return null;

  const index = Math.round(payload.value);
  const data = chartData[index];
  if (!data) return null;

  const date = new Date(data.date);
  const line1 = `${date.getMonth() + 1}월 ${date.getDate()}일`;
  const line2 = `${data.weekday}요일`;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="middle" fill="#6b7280" fontSize={11}>
        <tspan x={0} dy="0">
          {line1}
        </tspan>
        <tspan x={0} dy="13">
          {line2}
        </tspan>
      </text>
    </g>
  );
};

export default function DashboardChart({ chartData }: DashboardChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("1주");

  // 데이터 정렬 및 메모이제이션
  const sortedData = useMemo(
    () => [...chartData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [chartData],
  );

  // 데이터 필터링
  const filteredData = useMemo(() => {
    if (selectedPeriod === "All") {
      return sortedData;
    }

    const last = sortedData.at(-1);
    if (!last) return [];

    const lastDate = new Date(last.date);
    lastDate.setHours(0, 0, 0, 0);

    const days = selectedPeriod === "1일" ? 1 : selectedPeriod === "1주" ? 7 : 30;
    const threshold = new Date(lastDate);
    threshold.setDate(threshold.getDate() - (days - 1));

    return sortedData.filter((point) => {
      const current = new Date(point.date);
      current.setHours(0, 0, 0, 0);
      return current.getTime() >= threshold.getTime();
    });
  }, [selectedPeriod, sortedData]);

  // 데이터 필터링
  const processedData = useMemo(
    () => filteredData.map((point, index) => ({ ...point, index })),
    [filteredData],
  );

  const [hoveredOverride, setHoveredOverride] = useState<number | null>(null);
  const defaultHover = processedData.at(-1)?.index ?? null;
  const hoveredDate = useMemo(() => {
    if (
      hoveredOverride !== null &&
      processedData.some((point) => point.index === hoveredOverride)
    ) {
      return hoveredOverride;
    }
    return defaultHover;
  }, [hoveredOverride, processedData, defaultHover]);

  const tickValues = useMemo(() => {
    if (processedData.length === 0) return [];
    return processedData.map((point) => point.index);
  }, [processedData]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {/* 기간 선택 버튼 */}
        <div className="flex flex-wrap gap-2">
          {(["1일", "1주", "1개월", "All"] as Period[]).map((period) => (
            <button
              key={period}
              onClick={() => {
                setSelectedPeriod(period);
                setHoveredOverride(null);
              }}
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
        {/* 차트 색상 표시 영역 */}
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
            data={processedData}
            margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
            onMouseMove={(e) => {
              const label = e?.activeLabel;
              if (label === undefined || label === null) return;
              const numericLabel = Math.round(Number(label));
              if (!Number.isNaN(numericLabel)) {
                setHoveredOverride(numericLabel);
              }
            }}
            onMouseLeave={() => setHoveredOverride(null)}
          >
            <defs>
              <linearGradient id="colorUp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3" // 점선 패턴 : 3px 선, 3px 공백
              stroke="#e5e7eb" // 선 색상
              horizontal={true} // 수평선 표시
              vertical={false} // 수직선 표시
            />
            <XAxis
              dataKey="index" // 순번을 기준으로
              type="number"
              domain={processedData.length > 0 ? [-0.5, processedData.length - 0.5] : [0, 0]}
              stroke="#6b7280" // 선 색상
              axisLine={{ stroke: "#e5e7eb" }} // 기본 스타일
              tickLine={{ stroke: "#e5e7eb" }} // 눈금 선 스타일
              ticks={tickValues}
              interval={0}
              height={48}
              tickMargin={14}
              tick={<CustomTick chartData={processedData} />}
            />
            {/* 일자별 경계선 */}
            {processedData.map((item, index) => {
              // 첫 번째는 시작점이므로 경계선 표시X
              if (index === 0) return null;
              return (
                <ReferenceLine
                  key={`border-${index}`}
                  x={item.index} // 인덱스를 기준으로
                  stroke="#e5e7eb" // 선 색상
                  strokeWidth={1} // 선 두께 : 1px
                />
              );
            })}
            <YAxis
              domain={[50, 300]} // Y축 범위 : 50 ~ 300
              ticks={[50, 100, 150, 200, 250, 300]} // 눈금 위치
              stroke="#6b7280" // 선 색상
              tick={{ fontSize: 12, fill: "#6b7280" }} // 눈금 텍스트 스타일
              axisLine={{ stroke: "#e5e7eb" }} // 기본 스타일
              tickLine={{ stroke: "#e5e7eb" }} // 눈금 선 스타일
              width={40} // Y축 너비
            />
            <Tooltip content={<CustomTooltip chartData={processedData} />} />
            {hoveredDate !== null && (
              <ReferenceLine
                x={hoveredDate}
                stroke="#9ca3af" // 선 색상
                strokeWidth={1} // 선 두께
                strokeDasharray="5 5" // 5px 선, 5px 공백
              />
            )}
            <Area
              type="monotone" // 타입 : monotone
              dataKey="up" // 데이터 키 타입
              stroke="none" // 테두리 X
            />
            {/* hover 시 차트에 표시 되는 부분 */}
            <Line
              type="monotone"
              dataKey="up"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ fill: "#3b82f6", r: 0, strokeWidth: 0 }} // 점 스타일
              activeDot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} // 활성화 점 스타일
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
