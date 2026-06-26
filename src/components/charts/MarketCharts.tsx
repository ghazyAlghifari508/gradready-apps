"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card from "@/components/ui/Card";

type SalaryChartEntry = { name: string; min: number; max: number; avg: number };
type CategoryChartEntry = { category: string; count: number };

interface MarketChartsProps {
  salaryData: SalaryChartEntry[];
  categoryData: CategoryChartEntry[];
  formatRupiah: (v: number) => string;
}

export default function MarketCharts({ salaryData, categoryData, formatRupiah }: MarketChartsProps) {
  return (
    <div className="flex flex-col gap-8">
      <Card className="p-6">
        <h3 className="text-[#4B4B4B] font-bold text-[18px] mb-6">
          Komparasi Estimasi Gaji per Job Role (IDR)
        </h3>
        <div className="h-[350px] w-full">
          {salaryData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[#AFAFAF] font-bold text-[14px]">
              Data belum tersedia
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fill: "#AFAFAF", fontSize: 13, fontWeight: 700 }} />
                <YAxis
                  tickFormatter={(value) => `Rp${value / 1000000}M`}
                  tick={{ fill: "#AFAFAF", fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip
                  formatter={(value: unknown) => [
                    typeof value === "number" ? formatRupiah(value) : String(value),
                    "",
                  ]}
                  cursor={{ fill: "rgba(0,0,0,0.02)" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "2px solid #E5E5E5",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "14px", fontWeight: 700, color: "#4B4B4B" }} />
                <Bar dataKey="min" name="Minimum (Entry)" fill="#1CB0F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="max" name="Maksimum (Mid+)" fill="#58CC02" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-[#4B4B4B] font-bold text-[18px] mb-6">
          Distribusi Skill per Kategori
        </h3>
        <div className="h-[300px] w-full">
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[#AFAFAF] font-bold text-[14px]">
              Data belum tersedia
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="category" tick={{ fill: "#AFAFAF", fontSize: 12, fontWeight: 700 }} />
                <YAxis tick={{ fill: "#AFAFAF", fontSize: 13, fontWeight: 700 }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "2px solid #E5E5E5" }}
                  formatter={(value: unknown) => [value as React.ReactNode, "Jumlah Skill"]}
                />
                <Legend wrapperStyle={{ paddingTop: "15px" }} />
                <Bar dataKey="count" name="Jumlah Skill" fill="#FF9600" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Card>
    </div>
  );
}
