"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  _count: { cvRecords: number };
}

import { Search, ArrowRight } from "lucide-react";

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/users?search=${encodeURIComponent(debounced)}`)
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .finally(() => setLoading(false));
  }, [debounced]);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setUpdating(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (!res.ok) throw new Error();
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      showToast(`Role berhasil diubah ke ${newRole}`, "success");
    } catch {
      showToast("Gagal mengubah role", "error");
    } finally {
      setUpdating(null);
    }
  };

  const roleColors = {
    admin: { bg: "rgba(255,150,0,0.1)", color: "#FF9600", border: "rgba(255,150,0,0.3)" },
    user: { bg: "rgba(88,204,2,0.08)", color: "#4EC604", border: "rgba(88,204,2,0.25)" },
  };

  return (
    <div>
      <h1
        style={{
          fontFamily: "'Fredoka One', cursive",
          fontSize: 32,
          color: "#1A1A2E",
          marginBottom: 4,
        }}
      >
        Kelola Pengguna
      </h1>
      <p style={{ fontSize: 14, color: "var(--gray-light)", marginBottom: 28, fontFamily: "'Nunito', sans-serif" }}>
        Lihat semua akun & ubah role akses.
      </p>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: "relative", maxWidth: 420 }}>
          <Search 
            size={18} 
            style={{ 
              position: "absolute", 
              left: 14, 
              top: "50%", 
              transform: "translateY(-50%)", 
              color: "var(--nav-text)" 
            }} 
          />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              height: 44,
              border: "2px solid var(--border-color)",
              borderRadius: 10,
              padding: "0 16px 0 42px",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "'Nunito', sans-serif",
              color: "var(--gray-text)",
              width: "100%",
              outline: "none",
              backgroundColor: "#FFFFFF",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#1CB0F6")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-color)")}
          />
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          border: "2px solid var(--border-color)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#F7F7F7", borderBottom: "2px solid var(--border-color)" }}>
              {["Nama", "Email", "Role", "CV Diupload", "Bergabung", "Aksi"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: 11,
                    fontWeight: 800,
                    color: "var(--gray-light)",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    fontFamily: "'Nunito', sans-serif",
                  }}
                >
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
                        <div
                          style={{
                            height: 14,
                            backgroundColor: "#F0F0F0",
                            borderRadius: 6,
                            width: j === 0 ? "70%" : j === 1 ? "90%" : "50%",
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : users.map((user) => {
                  const rc = roleColors[user.role];
                  return (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: "1px solid var(--border-color)",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#FAFAFA")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              backgroundColor: "var(--green)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 800,
                              color: "#FFFFFF",
                              flexShrink: 0,
                              fontFamily: "'Nunito', sans-serif",
                            }}
                          >
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif" }}>
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--gray-light)", fontFamily: "'Nunito', sans-serif" }}>
                        {user.email}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            padding: "3px 10px",
                            borderRadius: 20,
                            backgroundColor: rc.bg,
                            color: rc.color,
                            border: `1px solid ${rc.border}`,
                            fontFamily: "'Nunito', sans-serif",
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 700, color: "var(--gray-text)", fontFamily: "'Nunito', sans-serif" }}>
                        {user._count.cvRecords}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--gray-light)", fontFamily: "'Nunito', sans-serif" }}>
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <button
                          onClick={() => toggleRole(user.id, user.role)}
                          disabled={updating === user.id}
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            padding: "6px 14px",
                            borderRadius: 8,
                            border: "2px solid var(--border-color)",
                            cursor: updating === user.id ? "default" : "pointer",
                            backgroundColor: "transparent",
                            color: "var(--gray-text)",
                            fontFamily: "'Nunito', sans-serif",
                            opacity: updating === user.id ? 0.5 : 1,
                            transition: "all 0.15s",
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                          }}
                          onMouseEnter={(e) => {
                            if (updating !== user.id) {
                              e.currentTarget.style.borderColor = "#FF9600";
                              e.currentTarget.style.color = "#FF9600";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--border-color)";
                            e.currentTarget.style.color = "var(--gray-text)";
                          }}
                        >
                          {updating === user.id
                            ? "Memperbarui..."
                            : user.role === "admin"
                            ? <><ArrowRight size={14} /> USER</>
                            : <><ArrowRight size={14} /> ADMIN</>}
                        </button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>

        {!loading && users.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "var(--gray-light)",
              fontSize: 14,
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Tidak ada pengguna ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
