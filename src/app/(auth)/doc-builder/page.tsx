"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import { useEffect, useState } from "react";

export default function DocBuilderHubPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/doc/history")
      .then((res) => res.json())
      .then((data) => {
        if (data.docs) {
          const newCounts: Record<string, number> = {};
          data.docs.forEach((doc: { docType: string }) => {
            newCounts[doc.docType] = (newCounts[doc.docType] || 0) + 1;
          });
          setCounts(newCounts);
        }
      });
  }, []);

  const features = [
    {
      title: "Motivation Letter",
      desc: "Generate surat motivasi formal untuk berbagai keperluan akademik dan karir.",
      type: "MOTIVATION",
      path: "/doc-builder/motivation-letter",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
      )
    },
    {
      title: "Cover Letter",
      desc: "Sesuaikan surat lamaran Anda spesifik sesuai dengan deksripsi lowongan yang dituju.",
      type: "COVER",
      path: "/doc-builder/cover-letter",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
      )
    },
    {
      title: "LinkedIn Summary",
      desc: "Buat profil About LinkedIn yang menarik, profesional, dan menarget industri Anda.",
      type: "LINKEDIN",
      path: "/doc-builder/linkedin",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
      )
    },
    {
      title: "Portfolio Description",
      desc: "Deskripsikan project di CV Anda dengan struktur berbasis dampak (impact-based).",
      type: "PORTFOLIO",
      path: "/doc-builder/portfolio",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
      )
    },
    {
      title: "Self-Introduction Script",
      desc: "Latih cara Anda memperkenalkan diri dalam 60 detik selama interview dan networking.",
      type: "SELF_INTRO",
      path: "/doc-builder/self-intro",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
      )
    },
    {
      title: "CV Builder Wizard",
      desc: "Buat CV baru dari kanvas kosong dan dipandu langsung oleh fitur AI Editor kami.",
      type: "CV",
      path: "/cv-builder",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>
      )
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto w-full" style={{ padding: "32px" }}>
      <div>
        <h1 className="font-['Fredoka_One'] text-[32px] text-[var(--dark-blue)] mb-2 uppercase">AI Career Doc Builder</h1>
        <p className="text-gray-600 max-w-2xl">
          Satu hub untuk semua kebutuhan dokumen karir Anda. Sistem cerdas kami akan mengisi profil secara otomatis, sehingga Anda hanya perlu memikirkan konteks posisi yang ingin dilamar.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((item, idx) => (
          <Link href={item.path} key={idx} className="block group">
            <Card className="h-full border border-gray-200 hover:border-(--green) transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0_0_var(--green)]">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gray-100 rounded-lg text-gray-700 group-hover:bg-green-100 group-hover:text-(--green) transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-display text-gray-800">{item.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                {item.desc}
              </p>
              
              <div className="mt-auto flex justify-between items-center text-xs font-semibold text-gray-500">
                <span>{counts[item.type] || 0} Dibuat</span>
                <span className="text-(--blue) group-hover:underline">Buka Builder &rarr;</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
