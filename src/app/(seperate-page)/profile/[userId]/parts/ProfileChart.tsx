"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import type { Payload as RechartsPayload } from "recharts/types/component/DefaultTooltipContent";

type ChartPoint = {
  date: string; 
  up: number;
  down: number;
  hold: number;
};

type ChartRow = ChartPoint & {
  tick: string;   
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

export default function ProfileChart({
  chartData,
  hasRealData,
}: {
  chartData: ChartPoint[];
  hasRealData: boolean;
}) {
  
  const data: ChartRow[] = useMemo(() => {
    const sorted = [...chartData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return sorted.map((p) => {
      const up = p.up ?? 0;
      const downAbs = Math.abs(p.down ?? 0); 
      const net = up - downAbs;

      return {
        ...p,
        tick: fmtMMDD(p.date),
        net,
        posDot: net > 0 ? net : null,
        negDot: net < 0 ? net : null,
        midDot: net === 0 ? 0 : null,
      };
    });
  }, [chartData]);

 
  const domain: [number, number] = useMemo(() => {
    if (data.length === 0) return [-5, 5];
    const maxAbs = Math.max(1, ...data.map((d) => Math.abs(d.net)));
    return [-maxAbs, maxAbs] as [number, number];
  }, [data]);

  
  type P = RechartsPayload<number, string>;

  const labelFmt: NonNullable<TooltipProps<number, string>["labelFormatter"]> = (
    label,
    payload,
  ) => {
    const row = (payload && payload[0]?.payload) as ChartRow | undefined;
    return `날짜: ${label} · 지수: ${row?.net ?? 0}`;
  };

  const valueFmt: NonNullable<TooltipProps<number, string>["formatter"]> = (
    _value: number,
    _name: string,
    item: P,
  ) => {
    const row = (item?.payload as ChartRow) ?? undefined;
    return [
      `UP ${row?.up ?? 0} / HOLD ${row?.hold ?? 0} / DOWN ${Math.abs(
        row?.down ?? 0,
      )}`,
      "상세",
    ];
  };

  return (
    <div className="relative w-full rounded-xl bg-white p-4 shadow-sm">
    
      <div className="absolute left-6 top-6 z-10 flex flex-col gap-3 text-[12px] font-semibold">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#EF4444]" />
          <span>UP</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#111827]" />
          <span>HOLD</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#3B82F6]" />
          <span>DOWN</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={data} margin={{ top: 28, right: 24, bottom: 22, left: 70 }}>
          <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
          <XAxis
            dataKey="tick"
            interval={0}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={{ stroke: "#E5E7EB" }}
          />
          <YAxis
            domain={domain}
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={{ stroke: "#E5E7EB" }}
            width={36}
          />

          <Tooltip
            contentStyle={{ borderRadius: 12, borderColor: "#E5E7EB" }}
            labelFormatter={labelFmt}
            formatter={valueFmt}
          />

          
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
        {!hasRealData &&
          "* 실제 데이터가 없어도 중심선 기준 미리보기를 표시합니다"}
      </p>
    </div>
  );
}
