"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface HistoryChartProps {
  data: { date: string; score: number }[];
}

export default function HistoryChart({ data }: HistoryChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--green)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--green)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gray-border)" />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "var(--gray-light)" }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "var(--gray-light)" }}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            fontWeight: 700,
          }}
          itemStyle={{ color: "var(--green)" }}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="var(--green)"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorScore)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
