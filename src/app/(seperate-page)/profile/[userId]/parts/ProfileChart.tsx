"use client";

import { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartPoint = {
  date: string;
  up: number;
  down: number;
  hold: number;
};

type ChartRow = ChartPoint & {
  tick: string;
  index: number;
  net: number;
  posDot: number | null;
  midDot: number | null;
};

function fmtMMDD(iso: string) {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload?: ChartRow;
    value?: number;
  }>;
  label?: string | number;
  chartData?: ChartRow[];
}

const CustomTooltip = ({ active, payload, label, chartData }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const row = payload[0]?.payload as ChartRow | undefined;
    if (!row) return null;

    // index -> 날짜로 변환
    let dateLabel: string;
    if (typeof label === "number") {
      const item = chartData?.[Math.round(label)];
      dateLabel = item ? item.tick : String(label);
    } else {
      dateLabel = label || row.tick;
    }

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl z-50 dark:bg-[#1e2939] dark:border-[#374151]">
        <p className="font-semibold text-sm mb-3 text-gray-800 dark:text-gray-300">
          날짜: {dateLabel} · 지수: {row.net ?? 0}
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 justify-start">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
              <span className="text-[#EF4444]">UP: </span> {row.up ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-2.5 justify-start">
            <div className="w-2.5 h-2.5 rounded-full bg-[#111827] dark:bg-[#9ca3af]"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
              <span className="text-[#111827] dark:text-[#9ca3af]">HOLD: </span> {row.hold ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-2.5 justify-start">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
              <span className="text-[#3B82F6]">DOWN: </span> {Math.abs(row.down ?? 0)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ProfileChart({
  chartData,
  hasRealData,
}: {
  chartData: ChartPoint[];
  hasRealData: boolean;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 다크 모드 감지
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const data: ChartRow[] = useMemo(() => {
    const sorted = [...chartData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return sorted.map((p, index) => {
      const up = p.up ?? 0;
      const downAbs = Math.abs(p.down ?? 0);
      const net = up - downAbs;

      return {
        ...p,
        tick: fmtMMDD(p.date),
        index,
        net,
        posDot: net > 0 ? net : null,
        negDot: net < 0 ? net : null,
        midDot: net === 0 ? 0 : null,
      };
    });
  }, [chartData]);

  // Y축 domain
  const domain: [number, number] = useMemo(() => {
    if (data.length === 0) return [-10, 10];

    const maxUp = Math.max(...data.map((d) => d.up ?? 0));
    const maxDown = Math.max(...data.map((d) => Math.abs(d.down ?? 0)));
    const maxHold = Math.max(...data.map((d) => d.hold ?? 0));

    const netMax = Math.max(...data.map((d) => d.net ?? 0));
    const netMin = Math.min(...data.map((d) => d.net ?? 0));

    const positiveMax = Math.max(maxUp, maxDown, maxHold, netMax);
    const negativeMax = Math.max(maxDown, Math.abs(netMin));

    const maxAbs = Math.max(positiveMax, negativeMax);

    const padding = maxAbs * 0.3;
    const rawDomainMax = maxAbs + padding;
    const domainMax = Math.ceil(rawDomainMax / 10) * 10;
    return [-domainMax, domainMax] as [number, number];
  }, [data]);

  // Y축 ticks
  const yAxisTicks = useMemo(() => {
    const [domainMin, domainMax] = domain;
    if (domainMax === 10 && domainMin === -10) return [-10, 0, 10];

    let interval: number;
    if (domainMax <= 30) {
      interval = 10;
    } else if (domainMax <= 60) {
      interval = 20;
    } else if (domainMax <= 100) {
      interval = 30;
    } else {
      interval = 50;
    }

    const ticks: number[] = [0];

    // 양수
    for (let i = interval; i <= domainMax; i += interval) {
      ticks.push(i);
    }

    // 음수
    for (let i = -interval; i >= domainMin; i -= interval) {
      ticks.unshift(i);
    }

    return ticks.sort((a, b) => a - b);
  }, [domain]);

  // X축 domain
  const xAxisDomain: [number, number] = useMemo(() => {
    if (data.length === 0) return [0, 0];
    return [-0.5, data.length - 0.5] as [number, number];
  }, [data]);

  // X축 tick
  const xAxisTicks = useMemo(() => {
    return data.map((_, index) => index);
  }, [data]);

  return (
    <div className="relative w-full rounded-xl bg-white p-4 dark:bg-[#141d2b] outline-none focus:outline-none select-none">
      <div className="absolute left-0 top-6 z-10 flex flex-col gap-3 text-[12px] font-semibold">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#EF4444]" />
          <span className="dark:text-gray-300">UP</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#111827] dark:bg-[#9ca3af]" />
          <span className="dark:text-gray-300">HOLD</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#3B82F6]" />
          <span className="dark:text-gray-300">DOWN</span>
        </div>
      </div>

      <ResponsiveContainer
        width="100%"
        height={360}
        className="outline-none focus:outline-none select-none [&_svg]:outline-none [&_svg]:focus:outline-none [&_svg]:focus-visible:outline-none"
      >
        <LineChart data={data} margin={{ top: 28, right: 24, bottom: 22, left: 70 }}>
          <CartesianGrid
            strokeDasharray={isDarkMode ? "0" : "3 3"}
            stroke={isDarkMode ? "#374151" : "#E5E7EB"}
          />
          <XAxis
            dataKey="index"
            type="number"
            domain={xAxisDomain}
            ticks={xAxisTicks}
            interval={0}
            stroke={isDarkMode ? "#374151" : "#6B7280"}
            tick={{ fontSize: 12, fill: isDarkMode ? "#9ca3af" : "#6B7280" }}
            tickMargin={14}
            axisLine={{ stroke: isDarkMode ? "#374151" : "#E5E7EB" }}
            tickLine={{ stroke: isDarkMode ? "#374151" : "#E5E7EB" }}
            tickFormatter={(value) => {
              const item = data[Math.round(value)];
              return item ? item.tick : "";
            }}
          />
          <YAxis
            domain={domain}
            ticks={yAxisTicks}
            allowDecimals={false}
            stroke={isDarkMode ? "#374151" : "#6B7280"}
            tick={{ fontSize: 12, fill: isDarkMode ? "#9ca3af" : "#6B7280" }}
            axisLine={{ stroke: isDarkMode ? "#374151" : "#E5E7EB" }}
            tickLine={{ stroke: isDarkMode ? "#374151" : "#E5E7EB" }}
            width={36}
            tickFormatter={(value) => Math.round(value).toString()}
          />

          <Tooltip content={<CustomTooltip chartData={data} />} />

          <Line
            type="monotone"
            dataKey="net"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />

          <Line
            type="monotone"
            dataKey="posDot"
            stroke="transparent"
            dot={{ r: 4, fill: "#EF4444", stroke: "#ffffff", strokeWidth: 1 }}
            isAnimationActive={false}
          />

          <Line
            type="monotone"
            dataKey="midDot"
            stroke="transparent"
            dot={{ r: 4, fill: "#111827", stroke: "#ffffff", strokeWidth: 1 }}
            isAnimationActive={false}
          />

          <Line
            type="monotone"
            dataKey="negDot"
            stroke="transparent"
            dot={{ r: 4, fill: "#3B82F6", stroke: "#ffffff", strokeWidth: 1 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <p className="pointer-events-none select-none pr-2 pb-1 text-right text-[10px] text-gray-400">
        {!hasRealData && "* 실제 데이터가 없어도 중심선 기준 미리보기를 표시합니다"}
      </p>
    </div>
  );
}
