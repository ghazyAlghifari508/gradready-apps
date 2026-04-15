"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ClipboardList, X } from "lucide-react";

type SavedJob = {
  id: string;
  companyName: string;
  position: string;
  status: "SAVED" | "APPLIED" | "INTERVIEW" | "OFFERED" | "ACCEPTED" | "REJECTED";
  notes: string;
  savedAt: string;
};

const STATUS_COLORS = {
  SAVED: "#AFAFAF",
  APPLIED: "#1CB0F6",
  INTERVIEW: "#FF9600",
  OFFERED: "#CE82FF",
  ACCEPTED: "#58CC02",
  REJECTED: "#FF4B4B"
};

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [isAdding, setIsAdding] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs/saved");
      const data = await res.json();
      if (data.success) {
        setJobs(data.savedJobs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !position.trim()) return;

    try {
      const res = await fetch("/api/jobs/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, position }),
      });
      if (res.ok) {
        setIsAdding(false);
        setCompanyName("");
        setPosition("");
        fetchJobs();
      }
    } catch {
      alert("Error adding job");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch("/api/jobs/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchJobs();
    } catch {
      alert("Error updating status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus catatan lamaran ini?")) return;
    try {
      await fetch(`/api/jobs/saved?id=${id}`, {
        method: "DELETE",
      });
      fetchJobs();
    } catch {
      alert("Error deleting job");
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full" style={{ padding: "32px" }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="font-['Fredoka_One'] text-[32px] text-[var(--dark-blue)] mb-2 uppercase">Application Tracker</h1>
          <p className="text-[#777777] font-semibold">Pantau progres lamaran kerjamu di satu tempat.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? "BATAL" : "+ TAMBAH LAMARAN"}
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6 mb-8 border-t-4 border-[#1CB0F6]">
           <h3 className="text-[#4B4B4B] text-[16px] font-bold mb-4 uppercase">Data Lamaran Baru</h3>
           <form onSubmit={handleAddJob} className="flex flex-col md:flex-row gap-4">
              <input 
                autoFocus
                placeholder="Nama Perusahaan (misal: Tokopedia)" 
                className="flex-1 bg-[#F5F5F5] border-2 border-[#E5E5E5] rounded-xl px-4 py-3 text-[#4B4B4B] font-medium outline-none focus:border-[#1CB0F6] focus:bg-white"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <input 
                placeholder="Posisi (misal: Frontend Developer)" 
                className="flex-1 bg-[#F5F5F5] border-2 border-[#E5E5E5] rounded-xl px-4 py-3 text-[#4B4B4B] font-medium outline-none focus:border-[#1CB0F6] focus:bg-white"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
              <Button type="submit" disabled={!companyName || !position} variant={companyName && position ? "primary" : "ghost"}>
                 SIMPAN
              </Button>
           </form>
        </Card>
      )}

      {loading ? (
        <div className="text-center p-8 text-[#AFAFAF] font-bold animate-pulse">Memuat data tracker...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 px-6 border-2 border-dashed border-[#E5E5E5] rounded-3xl">
          <div className="flex justify-center text-[#AFAFAF] mb-4">
            <ClipboardList size={48} />
          </div>
          <h3 className="font-bold text-[20px] text-[#4B4B4B] mb-2">Belum ada lamaran tersimpan</h3>
          <p className="text-[#AFAFAF] font-medium mb-6">Mulai catat proses interview dan lamaranmu agar lebih terstruktur!</p>
          <Button onClick={() => setIsAdding(true)}>TAMBAH REKAMAN PERTAMA</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="p-5 flex flex-col justify-between border-t-8" style={{ borderTopColor: STATUS_COLORS[job.status] || "#E5E5E5" }}>
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                   <div className="text-[12px] font-bold px-2 py-1 rounded-[8px] text-white tracking-[0.5px]" style={{ backgroundColor: STATUS_COLORS[job.status] || "#E5E5E5" }}>
                     {job.status}
                   </div>
                   <button onClick={() => handleDelete(job.id)} className="text-[#AFAFAF] hover:text-[#FF4B4B] transition-colors">
                     <X size={20} strokeWidth={3} />
                   </button>
                </div>
                <h3 className="font-bold text-[20px] text-[#4B4B4B]">{job.position}</h3>
                <p className="font-semibold text-[#777777] text-[15px]">{job.companyName}</p>
                <div className="text-[12px] text-[#AFAFAF] font-medium mt-1">Disimpan: {new Date(job.savedAt).toLocaleDateString("id-ID")}</div>
              </div>
              
              <div className="pt-4 border-t-2 border-[#F5F5F5]">
                 <p className="text-[12px] font-bold text-[#AFAFAF] uppercase tracking-[1px] mb-2">Ubah Status</p>
                 <select 
                   value={job.status}
                   onChange={(e) => handleUpdateStatus(job.id, e.target.value)}
                   className="w-full bg-[#F5F5F5] border-2 border-[#E5E5E5] rounded-[10px] px-3 py-2 text-[#4B4B4B] font-bold outline-none focus:border-[#1CB0F6]"
                 >
                   {Object.keys(STATUS_COLORS).map((s: string) => <option key={s} value={s}>{s}</option>)}
                 </select>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
