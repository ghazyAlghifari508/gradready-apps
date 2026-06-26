"use client";

import { useEffect, useState } from "react";
import { useCrud } from "@/lib/useCrud";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  author: { name: string };
}

type ArticleForm = { title: string; excerpt: string; content: string; coverImage: string; published: boolean };

const EMPTY_FORM: ArticleForm = { title: "", excerpt: "", content: "", coverImage: "", published: false };

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 700, color: "var(--gray-text)",
  marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px",
};
const fieldStyle: React.CSSProperties = {
  width: "100%", border: "2px solid var(--border-color)", borderRadius: 10,
  padding: "10px 14px", fontSize: 14, fontWeight: 600, color: "var(--gray-text)",
  fontFamily: "'Nunito', sans-serif", outline: "none",
};

export default function AdminArticlesClientPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const crud = useCrud<ArticleForm>("/api/admin/articles", EMPTY_FORM, "Artikel ditambahkan!", "Artikel diperbarui!");

  const loadArticles = () => {
    setLoading(true);
    fetch("/api/admin/articles")
      .then((r) => r.json())
      .then((d) => setArticles(d.articles ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadArticles(); }, []);

  const handleSaveWrap = async () => {
    if (!crud.form.title || !crud.form.excerpt || !crud.form.content) {
      crud.showToast("Judul, ringkasan, dan konten wajib diisi!", "warning");
      return;
    }
    const ok = await crud.handleSave();
    if (ok) loadArticles();
  };

  const handleDeleteWrap = async (id: string) => {
    const deletedId = await crud.handleDelete(id);
    if (deletedId) setArticles((prev) => prev.filter((a) => a.id !== deletedId));
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 32, color: "#1A1A2E", marginBottom: 4 }}>Artikel & Blog</h1>
          <p style={{ fontSize: 14, color: "var(--gray-light)", fontFamily: "'Nunito', sans-serif" }}>Kelola berita dan artikel karir yang tampil di halaman publik.</p>
        </div>
        <button onClick={crud.openCreate} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", backgroundColor: "#58CC02", color: "#FFFFFF", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 800, fontFamily: "'Nunito', sans-serif", cursor: "pointer", boxShadow: "0 4px 0 #4EC604", flexShrink: 0 }}>
          + Tulis Artikel
        </button>
      </div>

      {crud.showForm && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={(e) => { if (e.target === e.currentTarget) crud.close(); }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: 20, border: "2px solid var(--border-color)", padding: "32px 36px", width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", fontFamily: "'Nunito', sans-serif" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", marginBottom: 24 }}>
              {crud.mode === "edit" ? "Edit Artikel" : "Tulis Artikel Baru"}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div><label style={labelStyle}>Judul *</label><input type="text" placeholder="Tips Lolos Screening ATS" value={crud.form.title} onChange={(e) => crud.setForm((p) => ({ ...p, title: e.target.value }))} style={{ ...fieldStyle, height: 44, padding: "0 14px" }} /></div>
              <div><label style={labelStyle}>URL Gambar Sampul (Opsional)</label><input type="text" placeholder="https://images.unsplash.com/..." value={crud.form.coverImage} onChange={(e) => crud.setForm((p) => ({ ...p, coverImage: e.target.value }))} style={{ ...fieldStyle, height: 44, padding: "0 14px" }} /></div>
              <div><label style={labelStyle}>Ringkasan (Excerpt) *</label><textarea placeholder="Ringkasan singkat yang tampil di daftar artikel..." value={crud.form.excerpt} onChange={(e) => crud.setForm((p) => ({ ...p, excerpt: e.target.value }))} rows={2} style={{ ...fieldStyle, resize: "vertical" }} /></div>
              <div><label style={labelStyle}>Konten *</label><textarea placeholder="Tulis isi artikel di sini. Pisahkan paragraf dengan baris kosong." value={crud.form.content} onChange={(e) => crud.setForm((p) => ({ ...p, content: e.target.value }))} rows={10} style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.6 }} /></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" id="published" checked={crud.form.published} onChange={(e) => crud.setForm((p) => ({ ...p, published: e.target.checked }))} style={{ width: 18, height: 18, accentColor: "#58CC02", cursor: "pointer" }} />
                <label htmlFor="published" style={{ fontSize: 14, fontWeight: 700, color: "var(--gray-text)", cursor: "pointer" }}>Terbitkan (tampil di halaman publik)</label>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              <button onClick={crud.close} style={{ flex: 1, height: 44, border: "2px solid var(--border-color)", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", backgroundColor: "transparent", color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif" }}>Batal</button>
              <button onClick={handleSaveWrap} disabled={crud.saving} style={{ flex: 2, height: 44, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: crud.saving ? "default" : "pointer", backgroundColor: crud.saving ? "var(--border-color)" : "#58CC02", color: "#FFFFFF", fontFamily: "'Nunito', sans-serif" }}>
                {crud.saving ? "Menyimpan..." : crud.mode === "edit" ? "Simpan" : "Publikasikan"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: "#FFFFFF", borderRadius: 16, border: "2px solid var(--border-color)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F7F7F7", borderBottom: "2px solid var(--border-color)" }}>
              {["Judul", "Status", "Penulis", "Dibuat", "Aksi"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "12px 16px", fontSize: 11, fontWeight: 800, color: "var(--gray-light)", textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "'Nunito', sans-serif" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border-color)" }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} style={{ padding: "14px 16px" }}><div style={{ height: 14, backgroundColor: "#F0F0F0", borderRadius: 6, width: j === 0 ? "80%" : "50%" }} /></td>
                ))}
              </tr>
            )) : articles.map((a) => (
              <tr key={a.id} style={{ borderBottom: "1px solid var(--border-color)" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FAFAFA")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "#1A1A2E", fontFamily: "'Nunito', sans-serif", maxWidth: 320 }}>{a.title}</td>
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 20, backgroundColor: a.published ? "rgba(88,204,2,0.08)" : "rgba(175,175,175,0.12)", color: a.published ? "#3D9A00" : "var(--gray-light)", fontFamily: "'Nunito', sans-serif" }}>{a.published ? "Terbit" : "Draft"}</span>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 12, fontWeight: 700, color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif" }}>{a.author?.name ?? "—"}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--gray-light)", fontFamily: "'Nunito', sans-serif" }}>
                  {new Date(a.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => crud.openEdit(a.id, { title: a.title, excerpt: a.excerpt, content: a.content, coverImage: a.coverImage ?? "", published: a.published })}
                      style={{ height: 30, padding: "0 10px", border: "2px solid var(--border-color)", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", backgroundColor: "transparent", color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif" }}>Edit</button>
                    {crud.confirmDeleteId === a.id ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#FF4B4B", fontFamily: "'Nunito', sans-serif" }}>Yakin?</span>
                        <button onClick={() => handleDeleteWrap(a.id)} style={{ height: 30, padding: "0 8px", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 800, cursor: "pointer", backgroundColor: "#FF4B4B", color: "#FFFFFF", fontFamily: "'Nunito', sans-serif" }}>Ya</button>
                        <button onClick={() => crud.setConfirmDeleteId(null)} style={{ height: 30, padding: "0 8px", border: "2px solid var(--border-color)", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", backgroundColor: "transparent", color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif" }}>Batal</button>
                      </div>
                    ) : (
                      <button onClick={() => crud.handleDelete(a.id)} disabled={crud.deleting === a.id}
                        style={{ height: 30, padding: "0 10px", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", backgroundColor: "rgba(255,75,75,0.08)", color: "#FF4B4B", fontFamily: "'Nunito', sans-serif", opacity: crud.deleting === a.id ? 0.5 : 1 }}>
                        {crud.deleting === a.id ? "..." : "Hapus"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && articles.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--gray-light)", fontSize: 14, fontFamily: "'Nunito', sans-serif" }}>
            Belum ada artikel. Klik &quot;+ Tulis Artikel&quot; untuk mulai.
          </div>
        )}
      </div>
    </div>
  );
}
