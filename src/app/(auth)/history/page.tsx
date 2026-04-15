import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import HistoryClientPage from "./HistoryClientPage";

export default async function HistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const userId = session.user.id;

  // Fetch CV history
  const cvHistory = await prisma.cvScoreHistory.findMany({
    where: { userId },
    orderBy: { recordedAt: "asc" },
  });

  const formattedChartData = cvHistory.map(entry => ({
    date: new Date(entry.recordedAt).toLocaleDateString("id-ID"),
    score: entry.score,
    timestamp: entry.recordedAt.getTime(),
  }));

  // Fetch generated docs
  const generatedDocs = await prisma.generatedDoc.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Fetch cv records
  const cvRecords = await prisma.cvRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <HistoryClientPage 
      chartData={formattedChartData} 
      docs={generatedDocs} 
      cvRecords={cvRecords} 
    />
  );
}
