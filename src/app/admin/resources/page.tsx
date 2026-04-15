"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Check } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
}

interface Resource {
  id: string;
  title: string;
  url: string;
  platform: string;
  durationWeeks: number | null;
  isFree: boolean;
  skill: Skill;
}

const PLATFORM_COLORS: Record<string, { bg: string; color: string }> = {
  YouTube: { bg: "rgba(255,0,0,0.08)", color: "#CC0000" },
  Dicoding: { bg: "rgba(88,204,2,0.08)", color: "#3D9A00" },
  Coursera: { bg: "rgba(28,176,246,0.08)", color: "#0079D5" },
  freeCodeCamp: { bg: "rgba(0,100,60,0.08)", color: "#006B3F" },
  Udemy: { bg: "rgba(168,0,255,0.08)", color: "#8B00CC" },
};

const EMPTY_FORM = {
  skillId: "",
  title: "",
  url: "",
  platform: "",
  durationWeeks: "",
  isFree: true,
};

export default function AdminResourcesPage() {
  const { showToast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSkill, setFilterSkill] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadResources = (skillId?: string) => {
    setLoading(true);
    const qs = skillId ? `?skillId=${skillId}` : "";
    fetch(`/api/admin/resources${qs}`)
      .then((r) => r.json())
      .then((d) => setResources(d.resources ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadResources();
    fetch("/api/admin/job-roles")
      .then((r) => r.json())
      .then(() => {});
    // Load skills from a simple endpoint
    fetch("/api/skills")
      .then((r) => r.json())
      .then((d) => setSkills(d.skills ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadResources(filterSkill || undefined);
  }, [filterSkill]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (r: Resource) => {
    setForm({
      skillId: r.skill.id,
      title: r.title,
      url: r.url,
      platform: r.platform,
      durationWeeks: r.durationWeeks?.toString() ?? "",
      isFree: r.isFree,
    });
    setEditId(r.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.url || !form.platform) {
      showToast("Judul, URL, dan platform wajib diisi!", "warning");
      return;
    }
    if (!editId && !form.skillId) {
      showToast("Pilih skill terlebih dahulu!", "warning");
      return;
    }
    setSaving(true);
    try {
      const url = editId ? `/api/admin/resources/${editId}` : "/api/admin/resources";
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showToast(editId ? "Sumber belajar diperbarui!" : "Sumber belajar ditambahkan!", "success");
      setShowForm(false);
      loadResources(filterSkill || undefined);
    } catch {
      showToast("Gagal menyimpan", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus sumber belajar ini?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Sumber belajar dihapus.", "info");
      setResources((prev) => prev.filter((r) => r.id !== id));
    } catch {
      showToast("Gagal menghapus", "error");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: "#1A1A2E", marginBottom: 4 }}>
            Sumber Belajar
          </h1>
          <p style={{ fontSize: 14, color: "var(--gray-light)", fontFamily: "'Nunito', sans-serif" }}>
            Kelola link kursus dan modul belajar untuk setiap skill.
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 18px",
            backgroundColor: "#58CC02",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 800,
            fontFamily: "'Nunito', sans-serif",
            cursor: "pointer",
            boxShadow: "0 4px 0 #4EC604",
            flexShrink: 0,
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = "translateY(4px)"; e.currentTarget.style.boxShadow = "none"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 0 #4EC604"; }}
        >
          + Tambah Sumber
        </button>
      </div>

      {/* Filter */}
      {skills.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            style={{
              height: 44, border: "2px solid var(--border-color)", borderRadius: 10, padding: "0 14px",
              fontSize: 14, fontWeight: 600, fontFamily: "'Nunito', sans-serif", color: "var(--gray-text)",
              outline: "none", backgroundColor: "#FFFFFF", cursor: "pointer", minWidth: 250,
            }}
          >
            <option value="">Semua Skill</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: 20, border: "2px solid var(--border-color)", padding: "32px 36px", width: "100%", maxWidth: 520, fontFamily: "'Nunito', sans-serif" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", marginBottom: 24 }}>
              {editId ? "Edit Sumber Belajar" : "Tambah Sumber Belajar"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {!editId && (
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--gray-text)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Skill *</label>
                  <select
                    value={form.skillId}
                    onChange={(e) => setForm((p) => ({ ...p, skillId: e.target.value }))}
                    style={{ width: "100%", height: 44, border: "2px solid var(--border-color)", borderRadius: 10, padding: "0 14px", fontSize: 14, fontWeight: 600, fontFamily: "'Nunito', sans-serif", color: "var(--gray-text)", outline: "none", backgroundColor: "#FFFFFF", cursor: "pointer" }}
                  >
                    <option value="">Pilih skill...</option>
                    {skills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              )}
              {[
                { id: "title", label: "Judul *", placeholder: "Belajar React dari Nol" },
                { id: "url", label: "URL *", placeholder: "https://youtube.com/..." },
                { id: "platform", label: "Platform *", placeholder: "YouTube / Dicoding / Coursera" },
                { id: "durationWeeks", label: "Durasi (minggu)", placeholder: "4" },
              ].map((f) => (
                <div key={f.id}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--gray-text)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    value={form[f.id as keyof typeof form] as string}
                    onChange={(e) => setForm((p) => ({ ...p, [f.id]: e.target.value }))}
                    style={{ width: "100%", height: 44, border: "2px solid var(--border-color)", borderRadius: 10, padding: "0 14px", fontSize: 14, fontWeight: 600, color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif", outline: "none" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#1CB0F6")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
                  />
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="checkbox"
                  id="isFree"
                  checked={form.isFree}
                  onChange={(e) => setForm((p) => ({ ...p, isFree: e.target.checked }))}
                  style={{ width: 18, height: 18, accentColor: "#58CC02", cursor: "pointer" }}
                />
                <label htmlFor="isFree" style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-text)", cursor: "pointer" }}>Gratis</label>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, height: 44, border: "2px solid var(--border-color)", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", backgroundColor: "transparent", color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif" }}>
                Batal
              </button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 2, height: 44, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: saving ? "default" : "pointer", backgroundColor: saving ? "var(--border-color)" : "#58CC02", color: "#FFFFFF", fontFamily: "'Nunito', sans-serif" }}>
                {saving ? "Menyimpan..." : editId ? "Simpan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: 16, border: "2px solid var(--border-color)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F7F7F7", borderBottom: "2px solid var(--border-color)" }}>
              {["Judul", "Platform", "Skill", "Durasi", "Gratis?", "Aksi"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 800, color: "var(--gray-light)", textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "'Nunito', sans-serif" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} style={{ padding: "14px 16px" }}>
                        <div style={{ height: 14, backgroundColor: "#F0F0F0", borderRadius: 6, width: j === 0 ? "80%" : "50%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              : resources.map((r) => {
                  const pc = PLATFORM_COLORS[r.platform] ?? { bg: "#F0F0F0", color: "var(--gray-text)" };
                  return (
                    <tr key={r.id} style={{ borderBottom: "1px solid var(--border-color)" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAFAFA")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <td style={{ padding: "14px 16px" }}>
                        <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 700, color: "#1CB0F6", textDecoration: "none", fontFamily: "'Nunito', sans-serif" }}>
                          {r.title}
                        </a>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 20, backgroundColor: pc.bg, color: pc.color, fontFamily: "'Nunito', sans-serif" }}>
                          {r.platform}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 12, fontWeight: 700, color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif" }}>{r.skill.name}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--gray-light)", fontFamily: "'Nunito', sans-serif" }}>{r.durationWeeks ? `${r.durationWeeks} minggu` : "—"}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: r.isFree ? "#58CC02" : "#FF4B4B", fontFamily: "'Nunito', sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                          {r.isFree ? <><Check size={14} strokeWidth={3} /> Gratis</> : "Berbayar"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => openEdit(r)} style={{ height: 30, padding: "0 10px", border: "2px solid var(--border-color)", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", backgroundColor: "transparent", color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif" }}
                            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1CB0F6"; e.currentTarget.style.color = "#1CB0F6"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.color = "var(--gray-text)"; }}
                          >Edit</button>
                          <button onClick={() => handleDelete(r.id)} disabled={deleting === r.id} style={{ height: 30, padding: "0 10px", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", backgroundColor: "rgba(255,75,75,0.08)", color: "#FF4B4B", fontFamily: "'Nunito', sans-serif", opacity: deleting === r.id ? 0.5 : 1 }}>
                            {deleting === r.id ? "..." : "Hapus"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
        {!loading && resources.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--gray-light)", fontSize: 14, fontFamily: "'Nunito', sans-serif" }}>
            Belum ada sumber belajar. Klik &quot;+ Tambah Sumber&quot; untuk mulai.
          </div>
        )}
      </div>
    </div>
  );
}
