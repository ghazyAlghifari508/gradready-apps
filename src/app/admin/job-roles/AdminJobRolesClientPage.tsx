"use client";

import { useEffect, useState } from "react";
import { useCrud } from "@/lib/useCrud";

interface JobRole {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  avgSalaryMin?: number | null;
  avgSalaryMax?: number | null;
  demandLevel: "HIGH" | "MEDIUM" | "LOW";
  _count: { skills: number; profiles: number };
}

const DEMAND_COLORS = {
  HIGH: { bg: "rgba(255,75,75,0.1)", color: "#FF4B4B", border: "rgba(255,75,75,0.3)" },
  MEDIUM: { bg: "rgba(255,150,0,0.1)", color: "#FF9600", border: "rgba(255,150,0,0.3)" },
  LOW: { bg: "rgba(88,204,2,0.08)", color: "#58CC02", border: "rgba(88,204,2,0.25)" },
};

type JobRoleForm = {
  name: string; category: string; description: string;
  avgSalaryMin: string; avgSalaryMax: string;
  demandLevel: "HIGH" | "MEDIUM" | "LOW";
};

const EMPTY_FORM: JobRoleForm = {
  name: "", category: "", description: "",
  avgSalaryMin: "", avgSalaryMax: "",
  demandLevel: "MEDIUM",
};

export default function AdminJobRolesPage() {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [loading, setLoading] = useState(true);
  const crud = useCrud<JobRoleForm>("/api/admin/job-roles", EMPTY_FORM, "Job role berhasil dibuat!", "Job role berhasil diperbarui!");

  const loadRoles = () => {
    setLoading(true);
    fetch("/api/admin/job-roles")
      .then((r) => r.json())
      .then((d) => setRoles(d.jobRoles ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadRoles(); }, []);

  const handleSaveWrap = async () => {
    if (!crud.form.name || !crud.form.category) {
      crud.showToast("Nama dan kategori wajib diisi!", "warning");
      return;
    }
    const ok = await crud.handleSave();
    if (ok) loadRoles();
  };

  const handleDeleteWrap = async (id: string) => {
    const deletedId = await crud.handleDelete(id);
    if (deletedId) setRoles((prev) => prev.filter((r) => r.id !== deletedId));
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: "#1A1A2E", marginBottom: 4 }}>
            Kelola Job Roles
          </h1>
          <p style={{ fontSize: 14, color: "var(--gray-light)", fontFamily: "'Nunito', sans-serif" }}>
            Tambah dan kelola kategori pekerjaan untuk platform GradReady.
          </p>
        </div>
        <button
          onClick={crud.openCreate}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px",
            backgroundColor: "#58CC02", color: "#FFFFFF", border: "none", borderRadius: 10,
            fontSize: 13, fontWeight: 800, fontFamily: "'Nunito', sans-serif",
            cursor: "pointer", boxShadow: "0 4px 0 #4EC604", transition: "all 0.1s", flexShrink: 0,
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(4px)"; e.currentTarget.style.boxShadow = "none"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 0 #4EC604"; }}
        >
          + Tambah Job Role
        </button>
      </div>

      {crud.showForm && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={(e) => { if (e.target === e.currentTarget) crud.close(); }}
        >
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: 20, border: "2px solid var(--border-color)", padding: "32px 36px", width: "100%", maxWidth: 520, fontFamily: "'Nunito', sans-serif" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", marginBottom: 24 }}>
              {crud.mode === "edit" ? "Edit Job Role" : "Tambah Job Role Baru"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { id: "name", label: "Nama Job Role *", placeholder: "Frontend Developer" },
                { id: "category", label: "Kategori *", placeholder: "Technology" },
                { id: "description", label: "Deskripsi (opsional)", placeholder: "Deskripsi singkat..." },
                { id: "avgSalaryMin", label: "Gaji Min (Rp)", placeholder: "5000000" },
                { id: "avgSalaryMax", label: "Gaji Max (Rp)", placeholder: "15000000" },
              ].map((f) => (
                <div key={f.id}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--gray-text)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {f.label}
                  </label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={crud.form[f.id as keyof JobRoleForm] as string}
                    onChange={(e) => crud.setForm((prev) => ({ ...prev, [f.id]: e.target.value }))}
                    style={{ width: "100%", height: 44, border: "2px solid var(--border-color)", borderRadius: 10, padding: "0 14px", fontSize: 14, fontWeight: 600, color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif", outline: "none" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#1CB0F6")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--gray-text)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Demand Level
                </label>
                <select
                  value={crud.form.demandLevel}
                  onChange={(e) => crud.setForm((prev) => ({ ...prev, demandLevel: e.target.value as "HIGH" | "MEDIUM" | "LOW" }))}
                  style={{ width: "100%", height: 44, border: "2px solid var(--border-color)", borderRadius: 10, padding: "0 14px", fontSize: 14, fontWeight: 600, color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif", outline: "none", backgroundColor: "#FFFFFF", cursor: "pointer" }}
                >
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={crud.close}
                style={{ flex: 1, height: 44, border: "2px solid var(--border-color)", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", backgroundColor: "transparent", color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif" }}>
                Batal
              </button>
              <button onClick={handleSaveWrap} disabled={crud.saving}
                style={{ flex: 2, height: 44, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: crud.saving ? "default" : "pointer", backgroundColor: crud.saving ? "var(--border-color)" : "#58CC02", color: "#FFFFFF", fontFamily: "'Nunito', sans-serif" }}>
                {crud.saving ? "Menyimpan..." : crud.mode === "edit" ? "Simpan Perubahan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ backgroundColor: "#FFFFFF", borderRadius: 16, border: "2px solid var(--border-color)", padding: 24, height: 160 }}>
              <div style={{ height: 18, width: "60%", backgroundColor: "#F0F0F0", borderRadius: 6, marginBottom: 12 }} />
              <div style={{ height: 12, width: "40%", backgroundColor: "#F0F0F0", borderRadius: 6 }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {roles.map((role) => {
            const dc = DEMAND_COLORS[role.demandLevel];
            return (
              <div key={role.id}
                style={{ backgroundColor: "#FFFFFF", borderRadius: 16, border: "2px solid var(--border-color)", padding: "20px 22px", display: "flex", flexDirection: "column", gap: 8, transition: "border-color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#58CC02")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E", fontFamily: "'Nunito', sans-serif", marginBottom: 2 }}>{role.name}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-light)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "'Nunito', sans-serif" }}>{role.category}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 20, backgroundColor: dc.bg, color: dc.color, border: `1px solid ${dc.border}`, fontFamily: "'Nunito', sans-serif", flexShrink: 0 }}>{role.demandLevel}</span>
                </div>
                {role.description && <div style={{ fontSize: 12, color: "var(--gray-light)", lineHeight: 1.5, fontFamily: "'Nunito', sans-serif" }}>{role.description}</div>}
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-light)", fontFamily: "'Nunito', sans-serif" }}>{role._count.skills} skill · {role._count.profiles} user</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button onClick={() => crud.openEdit(role.id, { name: role.name, category: role.category, description: role.description ?? "", avgSalaryMin: role.avgSalaryMin?.toString() ?? "", avgSalaryMax: role.avgSalaryMax?.toString() ?? "", demandLevel: role.demandLevel })}
                    style={{ flex: 1, height: 34, border: "2px solid var(--border-color)", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", backgroundColor: "transparent", color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1CB0F6"; e.currentTarget.style.color = "#1CB0F6"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--gray-text)"; }}
                  >Edit</button>
                  {crud.confirmDeleteId === role.id ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#FF4B4B", fontFamily: "'Nunito', sans-serif" }}>Yakin?</span>
                      <button onClick={() => handleDeleteWrap(role.id)} style={{ flex: 1, height: 34, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: "pointer", backgroundColor: "#FF4B4B", color: "#FFFFFF", fontFamily: "'Nunito', sans-serif" }}>Ya</button>
                      <button onClick={() => crud.setConfirmDeleteId(null)} style={{ flex: 1, height: 34, border: "2px solid var(--border-color)", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", backgroundColor: "transparent", color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif" }}>Batal</button>
                    </div>
                  ) : (
                    <button onClick={() => crud.handleDelete(role.id)} disabled={crud.deleting === role.id}
                      style={{ flex: 1, height: 34, border: "2px solid transparent", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", backgroundColor: "rgba(255,75,75,0.08)", color: "#FF4B4B", fontFamily: "'Nunito', sans-serif", opacity: crud.deleting === role.id ? 0.5 : 1 }}>
                      {crud.deleting === role.id ? "..." : "Hapus"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && roles.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--gray-light)", fontFamily: "'Nunito', sans-serif" }}>
          Belum ada job role. Klik &quot;+ Tambah Job Role&quot; untuk mulai.
        </div>
      )}
    </div>
  );
}
