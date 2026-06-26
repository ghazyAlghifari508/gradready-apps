"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";
import { formatIDR } from "@/lib/format";

const MarketCharts = dynamic(() => import("@/components/charts/MarketCharts"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[350px] text-[#AFAFAF] font-bold text-[14px]">
      Memuat grafik...
    </div>
  ),
});

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

type SkillByCategory = { category: string; count: number };
type RoleByDemand = { level: "HIGH" | "MEDIUM" | "LOW"; count: number };

const DEMAND_LABEL: Record<string, string> = {
  HIGH: "Tinggi",
  MEDIUM: "Sedang",
  LOW: "Rendah",
};
const DEMAND_COLOR: Record<string, string> = {
  HIGH: "#58CC02",
  MEDIUM: "#FF9600",
  LOW: "#AFAFAF",
};

export default function MarketDashboard() {
  const [topSkills, setTopSkills] = useState<TopSkill[]>([]);
  const [jobRoles, setJobRoles] = useState<JobRole[]>([]);
  const [skillsByCategory, setSkillsByCategory] = useState<SkillByCategory[]>([]);
  const [rolesByDemand, setRolesByDemand] = useState<RoleByDemand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      try {
        const res = await fetch("/api/market/overview", { signal: controller.signal });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Gagal memuat data pasar");
        setTopSkills(data.topSkills || []);
        setJobRoles(data.jobRoles || []);
        setSkillsByCategory(data.skillsByCategory || []);
        setRolesByDemand(data.rolesByDemand || []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => controller.abort();
  }, []);

  const chartData = jobRoles.map((role) => ({
    name: role.name,
    min: role.avgSalaryMin,
    max: role.avgSalaryMax,
    avg: (role.avgSalaryMin + role.avgSalaryMax) / 2,
  }));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px" }}>
      <div className="mb-8">
        <h1 className="font-['Fredoka_One'] text-[32px] text-[var(--dark-blue)] mb-2 uppercase tracking-wide">
          Job Market Insight
        </h1>
        <p className="text-[#777777] font-semibold text-[16px]">
          Pantau tren skill paling dicari dan prospek gaji di industri digital
          saat ini.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-[#AFAFAF] font-bold" role="status" aria-live="polite">
          Memuat data pasar...
        </div>
      ) : error ? (
        <div className="flex justify-center py-20 text-red-500 font-bold" role="alert">
          {error}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* TOP WIDGETS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-t-4 border-[#58CC02]">
              <h3 className="text-[#AFAFAF] text-[12px] font-bold tracking-[1px] uppercase mb-2">
                Skill Tertinggi Saat Ini
              </h3>
              <div className="text-[24px] font-['Fredoka_One'] text-[#4B4B4B]">
                {topSkills[0]?.name || "N/A"}
              </div>
              <div className="mt-2 text-[#58CC02] font-bold text-[14px]">
                Permintaan sangat tinggi
              </div>
            </Card>
            <Card className="p-6 border-t-4 border-[#1CB0F6]">
              <h3 className="text-[#AFAFAF] text-[12px] font-bold tracking-[1px] uppercase mb-2">
                Peran Terpopuler
              </h3>
              <div className="text-[24px] font-['Fredoka_One'] text-[#4B4B4B]">
                {jobRoles.find((r) => r.demandLevel === "HIGH")?.name || "N/A"}
              </div>
              <div className="mt-2 text-[#1CB0F6] font-bold text-[14px]">
                Banyak dibuka loker
              </div>
            </Card>
            <Card className="p-6 border-t-4 border-[#FF9600]">
              <h3 className="text-[#AFAFAF] text-[12px] font-bold tracking-[1px] uppercase mb-2">
                Rata-rata Gaji Min
              </h3>
              <div className="text-[24px] font-['Fredoka_One'] text-[#4B4B4B]">
                {chartData.length > 0
                  ? formatIDR(Math.round(chartData.reduce((s, r) => s + r.min, 0) / chartData.length))
                  : "N/A"}
              </div>
              <div className="mt-2 text-[#FF9600] font-bold text-[14px]">
                Level Entry (Fresh Grad)
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CHARTS CONTAINER */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <MarketCharts salaryData={chartData} categoryData={skillsByCategory} formatRupiah={formatIDR} />
            </div>

            {/* SIDEBAR */}
            <div className="flex flex-col gap-6">
              <Card className="p-6">
                <h3 className="text-[#4B4B4B] font-bold text-[18px] mb-6 flex items-center justify-between">
                  Top Skills{" "}
                  <span className="text-[12px] bg-[#E5E5E5] px-2 py-1 rounded text-[#777777]">
                    HOT
                  </span>
                </h3>
                <div className="flex flex-col gap-4">
                  {topSkills.length === 0 ? (
                    <div className="text-[#AFAFAF] text-[14px] font-semibold text-center py-4">
                      Data belum tersedia
                    </div>
                  ) : (
                    topSkills.map((skill, index) => (
                      <div key={skill.id} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[15px] font-bold">
                          <span className="text-[#4B4B4B] flex items-center gap-1">
                            {index < 3 && (
                              <span className="text-[10px] bg-[#FFF3CD] text-[#FF9600] px-1 rounded font-black">TOP</span>
                            )}
                            {index + 1}. {skill.name}
                          </span>
                          <span className="text-[#AFAFAF] text-[13px]">{skill.category}</span>
                        </div>
                        <div
                          className="w-full h-[10px] bg-[#F5F5F5] rounded-full overflow-hidden"
                          role="progressbar"
                          aria-label={`${skill.name}: demand score ${skill.demandScore}${index < 3 ? ", top skill" : ""}`}
                          aria-valuenow={Math.min(100, 40 + skill.demandScore * 2)}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(100, 40 + skill.demandScore * 2)}%`,
                              backgroundColor: index < 3 ? "var(--green)" : "var(--blue)",
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* DEMAND LEVEL DISTRIBUTION */}
              {rolesByDemand.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-[#4B4B4B] font-bold text-[18px] mb-4">
                    Level Permintaan Role
                  </h3>
                  <div className="flex flex-col gap-3">
                    {rolesByDemand.map((r) => (
                      <div key={r.level} className="flex items-center justify-between">
                        <span
                          className="text-[14px] font-bold px-2 py-0.5 rounded"
                          style={{ color: DEMAND_COLOR[r.level] ?? "#AFAFAF", background: `${DEMAND_COLOR[r.level] ?? "#AFAFAF"}18` }}
                        >
                          {DEMAND_LABEL[r.level] ?? r.level}
                        </span>
                        <span className="text-[#4B4B4B] font-black text-[16px]">{r.count} role</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
