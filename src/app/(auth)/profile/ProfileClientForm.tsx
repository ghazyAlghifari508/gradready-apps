"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { AlertTriangle } from "lucide-react";

interface ProfileClientFormProps {
  user: any;
  jobRoles: any[];
}

export default function ProfileClientForm({ user, jobRoles }: ProfileClientFormProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: user.name || "",
    university: user.university || "",
    graduationYear: user.graduationYear?.toString() || "",
    bio: user.bio || "",
    linkedinUrl: user.linkedinUrl || "",
    githubUrl: user.githubUrl || "",
    phone: user.phone || "",
    targetJobId: user.targetJobId || ""
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        showToast("Profil kamu telah diperbarui.", "success");
      } else {
        showToast("Gagal memperbarui profil. Coba lagi nanti.", "error");
      }
    } catch(err) {
      console.error(err);
      showToast("Terjadi kesalahan koneksi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--dark-blue)", marginBottom: 8 }}>Informasi Dasar</h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-text)" }}>Email</label>
        <input 
           type="email" 
           value={user.email} 
           disabled 
           style={{ padding: "12px 16px", borderRadius: 12, border: "2px solid var(--gray-border)", backgroundColor: "var(--gray-bg)", color: "var(--gray-light)" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-text)" }}>Nama Lengkap</label>
          <input 
             type="text" 
             name="name"
             value={formData.name} 
             onChange={handleChange}
             required
             style={{ padding: "12px 16px", borderRadius: 12, border: "2px solid var(--gray-border)", outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-text)" }}>No Telepon</label>
          <input 
             type="text" 
             name="phone"
             value={formData.phone} 
             onChange={handleChange}
             style={{ padding: "12px 16px", borderRadius: 12, border: "2px solid var(--gray-border)", outline: "none" }}
          />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-text)" }}>Universitas</label>
          <input 
             type="text" 
             name="university"
             value={formData.university} 
             onChange={handleChange}
             style={{ padding: "12px 16px", borderRadius: 12, border: "2px solid var(--gray-border)", outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-text)" }}>Tahun Lulus</label>
          <input 
             type="number" 
             name="graduationYear"
             value={formData.graduationYear} 
             onChange={handleChange}
             style={{ padding: "12px 16px", borderRadius: 12, border: "2px solid var(--gray-border)", outline: "none" }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-text)" }}>Bio Singkat</label>
        <textarea 
           name="bio"
           value={formData.bio} 
           onChange={handleChange}
           rows={3}
           style={{ padding: "12px 16px", borderRadius: 12, border: "2px solid var(--gray-border)", outline: "none", resize: "none" }}
        />
      </div>

      <hr style={{ border: 0, borderBottom: "2px solid var(--gray-border)", margin: "8px 0" }} />

      <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--dark-blue)", marginBottom: 8 }}>Target Karir & Tautan</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-text)" }}>Target Job Role</label>
        <select 
           name="targetJobId"
           value={formData.targetJobId} 
           onChange={handleChange}
           style={{ padding: "12px 16px", borderRadius: 12, border: "2px solid rgba(255,160,0,0.5)", backgroundColor: "rgba(255,160,0,0.05)", outline: "none" }}
        >
          <option value="" disabled>Pilih target karir...</option>
          {jobRoles.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        <div style={{ fontSize: 12, color: "var(--orange)", fontWeight: 700, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <AlertTriangle size={14} /> Peringatan: Mengubah Target Job Role akan me-reset data Skill Gap Anda karena persyaratan berubah.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-text)" }}>LinkedIn URL</label>
          <input 
             type="url" 
             name="linkedinUrl"
             value={formData.linkedinUrl} 
             onChange={handleChange}
             placeholder="https://linkedin.com/in/..."
             style={{ padding: "12px 16px", borderRadius: 12, border: "2px solid var(--gray-border)", outline: "none" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-text)" }}>GitHub URL</label>
          <input 
             type="url" 
             name="githubUrl"
             value={formData.githubUrl} 
             onChange={handleChange}
             placeholder="https://github.com/..."
             style={{ padding: "12px 16px", borderRadius: 12, border: "2px solid var(--gray-border)", outline: "none" }}
          />
        </div>
      </div>
      
      <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16 }}>
         <Button type="submit" disabled={loading} className="w-full md:w-auto px-10">
           {loading ? "Menyimpan..." : "Simpan Perubahaan"}
         </Button>
      </div>
    </form>
  )
}
