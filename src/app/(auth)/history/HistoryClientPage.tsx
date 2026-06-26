"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";

const HistoryChart = dynamic(() => import("@/components/charts/HistoryChart"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-[var(--gray-light)] font-bold text-[14px]">
      Memuat grafik...
    </div>
  ),
});
import Badge from "@/components/ui/Badge";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface HistoryData {
  chartData: { date: string; score: number; timestamp: number }[];
  docs: { id: string; docType: string; createdAt: string }[];
  cvRecords: {
    id: string;
    versionNumber: number;
    isLatest: boolean;
    score: number | null;
    createdAt: string;
  }[];
}

export default function HistoryClientPage({
  chartData,
  docs,
  cvRecords,
}: HistoryData) {
  const aggregatedChartData = useMemo(() => {
    const map = new Map<
      string,
      { date: string; score: number; count: number }
    >();
    chartData.forEach((d) => {
      if (map.has(d.date)) {
        const existing = map.get(d.date)!;
        existing.score += d.score;
        existing.count += 1;
      } else {
        map.set(d.date, { date: d.date, score: d.score, count: 1 });
      }
    });
    return Array.from(map.values()).map(
      (d: { date: string; score: number; count: number }) => ({
        date: d.date,
        score: Math.round(d.score / d.count),
      }),
    );
  }, [chartData]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px" }}>
      <h1
        style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 32,
          color: "var(--dark-blue)",
          marginBottom: 16,
        }}
      >
        My History
      </h1>
      <p style={{ color: "var(--gray-text)", marginBottom: 32 }}>
        Lacak perkembangan skor CV dan portofolio dokumen kamu.
      </p>

      {/* CHART SECTION */}
      <Card className="mb-8">
        <h2
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: "var(--dark-blue)",
            marginBottom: 20,
          }}
        >
          Grafik Perkembangan CV Score
        </h2>
        {aggregatedChartData.length > 0 ? (
          <div style={{ width: "100%", height: 350 }}>
            <HistoryChart data={aggregatedChartData} />
          </div>
        ) : (
          <div
            style={{
              padding: 40,
              textAlign: "center",
              color: "var(--gray-light)",
            }}
          >
            Belum ada riwayat skor CV. Silakan unggah CV terlebih dahulu!
          </div>
        )}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
        {/* CV RECORDS TABLE */}
        <Card>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "var(--dark-blue)",
              marginBottom: 20,
            }}
          >
            Riwayat Upload CV
          </h2>
          {cvRecords.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid var(--gray-border)",
                      color: "var(--gray-light)",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "0 12px 12px 0", fontWeight: 700 }}>
                      VERSI
                    </th>
                    <th style={{ padding: "0 12px 12px 0", fontWeight: 700 }}>
                      TANGGAL
                    </th>
                    <th
                      style={{
                        padding: "0 0 12px 0",
                        fontWeight: 700,
                        textAlign: "right",
                      }}
                    >
                      SCORE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cvRecords.map((cv) => (
                    <tr
                      key={cv.id}
                      className="hover:bg-gray-50 transition-colors border-b border-[var(--gray-border)]"
                    >
                      <td className="py-4 pr-3 font-bold text-[var(--gray-text)]">
                        v{cv.versionNumber}{" "}
                        {cv.isLatest && (
                          <Badge variant="mastered" className="ml-2">
                            Terbaru
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 pr-3 text-[var(--gray-text)] font-medium">
                        {format(new Date(cv.createdAt), "dd MMM yyyy", {
                          locale: idLocale,
                        })}
                      </td>
                      <td
                        className={`py-4 text-right font-black text-lg ${cv.score && cv.score >= 70 ? "text-[var(--green)]" : "text-[var(--blue)]"}`}
                      >
                        {cv.score ? cv.score : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "var(--gray-light)", fontSize: 14 }}>
              Tidak ada data resume.
            </p>
          )}
        </Card>

        {/* GENERATED DOCS TABLE */}
        <Card>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "var(--dark-blue)",
              marginBottom: 20,
            }}
          >
            Dokumen AI Karir
          </h2>
          {docs.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                }}
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: "2px solid var(--gray-border)",
                      color: "var(--gray-light)",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "0 12px 12px 0", fontWeight: 700 }}>
                      TIPE DOKUMEN
                    </th>
                    <th
                      style={{
                        padding: "0 0 12px 0",
                        fontWeight: 700,
                        textAlign: "right",
                      }}
                    >
                      TANGGAL DIBUAT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc: any) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50 transition-colors border-b border-[var(--gray-border)]"
                    >
                      <td className="py-4 pr-3 font-bold text-[var(--gray-text)] capitalize">
                        {doc.docType.toLowerCase().replace("_", " ")}
                      </td>
                      <td className="py-4 text-right text-[var(--gray-text)] font-medium">
                        {format(new Date(doc.createdAt), "dd MMM yyyy", {
                          locale: idLocale,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: "var(--gray-light)", fontSize: 14 }}>
              Anda belum pernah meng-generate dokumen menggunakan AI.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
