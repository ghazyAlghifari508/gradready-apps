"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";

type TopSkill = {
  id: string;
  name: string;
  category: string;
  demandScore: number;
};

type JobRole = {
  id: string;
  name: string;
  demandLevel: "HIGH" | "MEDIUM" | "LOW";
  avgSalaryMin: number;
  avgSalaryMax: number;
};

export default function MarketDashboard() {
  const [topSkills, setTopSkills] = useState<TopSkill[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/market/overview");
        const data = await res.json();
        setTopSkills(data.topSkills || []);
        setJobRoles(data.jobRoles || []);
      } catch (err) {
        console.error("Failed to fetch market data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = jobRoles.map((role) => ({
    name: role.name,
    min: role.avgSalaryMin,
    max: role.avgSalaryMax,
    avg: (role.avgSalaryMin + role.avgSalaryMax) / 2,
  }));

  // Create trend line mock data based on the roles
  const trendData = [
    { year: "2022", Frontend: 60, Backend: 65, Data: 50 },
    { year: "2023", Frontend: 75, Backend: 72, Data: 70 },
    { year: "2024", Frontend: 88, Backend: 85, Data: 95 },
    { year: "2025", Frontend: 92, Backend: 90, Data: 110 },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px" }}>
      <div className="mb-8">
        <h1 className="font-['Fredoka_One'] text-[32px] text-[var(--dark-blue)] mb-2 uppercase tracking-wide">
          Job Market Insight
        </h1>
        <p className="text-[#777777] font-semibold text-[16px]">
          Pantau tren skill paling dicari dan prospek gaji di industri digital saat ini.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-[#AFAFAF] font-bold">
          Memuat data pasar...
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* TOP WIDGETS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-t-4 border-[#58CC02]">
              <h3 className="text-[#AFAFAF] text-[12px] font-bold tracking-[1px] uppercase mb-2">Skill Teringgi Saat Ini</h3>
              <div className="text-[24px] font-['Fredoka_One'] text-[#4B4B4B]">
                {topSkills[0]?.name || "N/A"}
              </div>
              <div className="mt-2 text-[#58CC02] font-bold text-[14px]">
                Permintaan sangat tinggi
              </div>
            </Card>
            <Card className="p-6 border-t-4 border-[#1CB0F6]">
              <h3 className="text-[#AFAFAF] text-[12px] font-bold tracking-[1px] uppercase mb-2">Peran Terpopuler</h3>
              <div className="text-[24px] font-['Fredoka_One'] text-[#4B4B4B]">
                {jobRoles.find((r) => r.demandLevel === "HIGH")?.name || "N/A"}
              </div>
              <div className="mt-2 text-[#1CB0F6] font-bold text-[14px]">
                Banyak dibuka loker
              </div>
            </Card>
            <Card className="p-6 border-t-4 border-[#FF9600]">
              <h3 className="text-[#AFAFAF] text-[12px] font-bold tracking-[1px] uppercase mb-2">Rata-rata Gaji Min</h3>
              <div className="text-[24px] font-['Fredoka_One'] text-[#4B4B4B]">
                {formatRupiah(chartData[1]?.min || 5000000)}
              </div>
              <div className="mt-2 text-[#FF9600] font-bold text-[14px]">
                Level Entry (Fresh Grad)
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CHARTS CONTAINER */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* SALARY BAR CHART */}
              <Card className="p-6">
                <h3 className="text-[#4B4B4B] font-bold text-[18px] mb-6">
                  Komparasi Estimasi Gaji per Job Role (IDR)
                </h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fill: "#AFAFAF", fontSize: 13, fontWeight: 700 }} />
                      <YAxis
                        tickFormatter={(value) => `Rp${value / 1000000}M`}
                        tick={{ fill: "#AFAFAF", fontSize: 12, fontWeight: 700 }}
                      />
                      <Tooltip
                        formatter={(value: unknown) => [typeof value === 'number' ? formatRupiah(value) : String(value), ""]}
                        cursor={{ fill: "rgba(0,0,0,0.02)" }}
                        contentStyle={{ borderRadius: '12px', border: '2px solid #E5E5E5', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: 700, color: '#4B4B4B' }} />
                      <Bar dataKey="min" name="Minimum (Entry)" fill="#1CB0F6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="max" name="Maksimum (Mid+)" fill="#58CC02" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* DEMAND TREND LINE CHART */}
              <Card className="p-6">
                <h3 className="text-[#4B4B4B] font-bold text-[18px] mb-6">
                  Tren Permintaan Industri (Index)
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="year" tick={{ fill: "#AFAFAF", fontSize: 13, fontWeight: 700 }} />
                      <YAxis tick={{ fill: "#AFAFAF", fontSize: 13, fontWeight: 700 }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #E5E5E5' }} />
                      <Legend wrapperStyle={{ paddingTop: '15px' }} />
                      <Line type="monotone" dataKey="Frontend" stroke="#1CB0F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Backend" stroke="#58CC02" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Data" stroke="#FF9600" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* TOP SKILLS SIDEBAR */}
            <div className="flex flex-col gap-6">
              <Card className="p-6">
                <h3 className="text-[#4B4B4B] font-bold text-[18px] mb-6 flex items-center justify-between">
                  Top Skills <span className="text-[12px] bg-[#E5E5E5] px-2 py-1 rounded text-[#777777]">HOT</span>
                </h3>
                <div className="flex flex-col gap-4">
                  {topSkills.map((skill, index) => (
                    <div key={skill.id} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[15px] font-bold">
                        <span className="text-[#4B4B4B]">
                          {index + 1}. {skill.name}
                        </span>
                        <span className="text-[#AFAFAF] text-[13px]">{skill.category}</span>
                      </div>
                      <div className="w-full h-[10px] bg-[#F5F5F5] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, 40 + skill.demandScore * 2)}%`,
                            backgroundColor: index < 3 ? "var(--green)" : "var(--blue)",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  {topSkills.length === 0 && (
                    <div className="text-[#AFAFAF] text-[14px] font-semibold text-center py-4">
                      Data belum tersedia
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
