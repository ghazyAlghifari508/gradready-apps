"use client";

import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Check } from "lucide-react";

type ChecksetItem = {
  id: string;
  category: "CV" | "Portfolio" | "LinkedIn" | "MockInterview";
  text: string;
  isCustom?: boolean;
};

// Generic Checklist Data for any tech roles
const BASE_CHECKLIST: ChecksetItem[] = [
  { id: "cv-1", category: "CV", text: "CV disesuaikan dengan format ATS (Tidak ada grafik/tabel kompleks)" },
  { id: "cv-2", category: "CV", text: "Menambahkan keyword dari Job Description target" },
  { id: "cv-3", category: "CV", text: "Memiliki deskripsi pencapaian dengan metrik (misal: 'Meningkatkan konversi sebesar 20%')" },
  { id: "port-1", category: "Portfolio", text: "Memiliki setidaknya 2 proyek relevan dengan role yang dilamar" },
  { id: "port-2", category: "Portfolio", text: "Setiap proyek di portfolio memiliki penjelasan PROBLEM dan SOLUTION" },
  { id: "port-3", category: "Portfolio", text: "Repository GitHub (jika tech) memiliki README.md yang jelas" },
  { id: "li-1", category: "LinkedIn", text: "Profile Picture terlihat profesional dan Headline jelas" },
  { id: "li-2", category: "LinkedIn", text: "Bagian 'About' tersusun rapi menggunakan teknik copywriting yang baik" },
  { id: "int-1", category: "MockInterview", text: "Sudah menyiapkan 3 studi kasus untuk menjawab pertanyaan metode STAR" },
  { id: "int-2", category: "MockInterview", text: "Sudah menyusun Self-Introduction kurang dari 90 detik" },
];

export default function ChecklistPage() {
  const { showToast } = useToast();
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [items, setItems] = useState<ChecksetItem[]>(BASE_CHECKLIST);
  const [newItemText, setNewItemText] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<ChecksetItem["category"]>("Portfolio");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsClient(true);
    // Load state from custom storage to bypass database freeze for this table
    const savedChecks = localStorage.getItem("gradready_checklist_checked");
    if (savedChecks) {
      setCheckedIds(JSON.parse(savedChecks));
    }

    const savedCustoms = localStorage.getItem("gradready_checklist_customs");
    if (savedCustoms) {
      const customs = JSON.parse(savedCustoms);
      setItems([...BASE_CHECKLIST, ...customs]);
    }
  }, []);

  const handleToggle = (id: string) => {
    let newChecks;
    if (checkedIds.includes(id)) {
      newChecks = checkedIds.filter((cid) => cid !== id);
    } else {
      newChecks = [...checkedIds, id];
    }
    setCheckedIds(newChecks);
    localStorage.setItem("gradready_checklist_checked", JSON.stringify(newChecks));
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: ChecksetItem = {
      id: `custom-${Date.now()}`,
      text: newItemText,
      category: newItemCategory,
      isCustom: true,
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    setNewItemText("");

    const customs = updatedItems.filter(i => i.isCustom);
    localStorage.setItem("gradready_checklist_customs", JSON.stringify(customs));
    
    showToast("Persiapan baru kamu berhasil disimpan.", "success");
  };

  const categories = ["CV", "Portfolio", "LinkedIn", "MockInterview"];
  const progress = items.length === 0 ? 0 : Math.round((checkedIds.length / items.length) * 100);

  if (!isClient) {
    return <div className="p-8 text-center text-[#AFAFAF] font-bold">Memuat Checklist...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto w-full" style={{ padding: "32px" }}>
      <div className="mb-6">
        <h1 className="font-['Fredoka_One'] text-[32px] text-[var(--dark-blue)] mb-2 uppercase">Checklist Persiapan Karir</h1>
        <p className="text-[#777777] font-semibold">Tandai langkah-langkah yang sudah kamu penuhi sebelum melamar pekerjaan.</p>
      </div>

      <Card className="p-6 mb-8 border-t-4 border-[#58CC02] flex flex-col md:flex-row items-center gap-6">
        <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center border-[8px]" style={{ borderColor: progress === 100 ? "#58CC02" : "rgba(88,204,2,0.2)"}}>
          <span className="font-['Fredoka_One'] text-[32px] text-[#58CC02]">{progress}%</span>
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-[22px] font-bold text-[#4B4B4B] mb-2">
             {progress === 100 ? "Luar Biasa! Kamu Siap Melamar!" : "Progress Persiapan Kamu"}
          </h2>
          <p className="text-[#777777] font-medium text-[15px]">
            {checkedIds.length} dari {items.length} prasyarat penting telah terpenuhi. 
            Selesaikan sisa PR kamu untuk meningkatkan probabilitas panggilan interview.
          </p>
        </div>
      </Card>

      <div className="flex flex-col gap-8">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          if (catItems.length === 0) return null;
          
          return (
            <div key={cat}>
              <h3 className="text-[#AFAFAF] text-[13px] font-bold tracking-[1.5px] uppercase mb-4 pl-2 border-l-4 border-[#1CB0F6]">
                {cat}
              </h3>
              <div className="flex flex-col gap-3">
                {catItems.map((item) => {
                  const isChecked = checkedIds.includes(item.id);
                  return (
                    <div
                      key={item.id} 
                      onClick={() => handleToggle(item.id)}
                    >
                      <Card 
                        className={`p-4 flex gap-4 cursor-pointer transition-colors ${isChecked ? 'bg-[rgba(88,204,2,0.05)] border-[#58CC02]' : 'border-[#E5E5E5]'}`}
                      >
                        <div className={`shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center text-white font-bold transition-colors ${isChecked ? 'bg-[#58CC02] border-[#58CC02]' : 'border-[#E5E5E5]'}`}>
                          {isChecked && <Check size={14} strokeWidth={4} color="white" />}
                        </div>
                        <div>
                          <div className={`text-[15px] font-semibold transition-all ${isChecked ? 'text-[#AFAFAF] line-through' : 'text-[#4B4B4B]'}`}>
                            {item.text}
                          </div>
                          {item.isCustom && (
                            <span className="text-[11px] font-bold text-[#1CB0F6] uppercase mt-1 inline-block">CUSTOM</span>
                          )}
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 pt-8 border-t-2 border-[#E5E5E5]">
        <h3 className="text-[#4B4B4B] text-[16px] font-bold mb-4">Tambah Item Persiapan (Opsional)</h3>
        <form onSubmit={handleAddCustom} className="flex flex-col sm:flex-row gap-3">
          <select 
            value={newItemCategory} 
            onChange={(e) => setNewItemCategory(e.target.value as ChecksetItem["category"])}
            className="h-12 px-4 rounded-[12px] bg-[#F5F5F5] border-2 border-[#E5E5E5] text-[#4B4B4B] font-bold text-[14px] focus:outline-none focus:border-[#1CB0F6]"
          >
            {categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input 
            type="text" 
            placeholder="Ketik tugas persiapan barumu..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="flex-1 h-12 px-4 rounded-[12px] bg-[#F5F5F5] border-2 border-[#E5E5E5] text-[#4B4B4B] font-medium text-[15px] focus:outline-none focus:border-[#1CB0F6] focus:bg-white"
          />
          <Button type="submit" disabled={!newItemText.trim()} variant={newItemText.trim() ? "primary" : "ghost"}>TAMBAH</Button>
        </form>
      </div>
    </div>
  );
}
