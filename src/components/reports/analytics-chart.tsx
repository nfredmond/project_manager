"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface AnalyticsChartProps {
  data: { label: string; budget: number; spent: number }[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="budget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="spent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => `$${(value / 1_000_000).toFixed(1)}M`} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
          <Area type="monotone" dataKey="budget" stroke="#2563eb" fill="url(#budget)" strokeWidth={2} />
          <Area type="monotone" dataKey="spent" stroke="#f97316" fill="url(#spent)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

