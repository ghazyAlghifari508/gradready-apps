import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog & Artikel Karir - GradReady",
};

const PAGE_SIZE = 6;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [total, articles] = await Promise.all([
    prisma.article.count({ where: { published: true } }),
    prisma.article.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { author: { select: { name: true } } },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px" }}>
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 32,
            color: "var(--dark-blue)",
            marginBottom: 8,
          }}
        >
          Blog & Artikel Karir
        </h1>
        <p style={{ color: "var(--gray-light)", fontWeight: 700, margin: 0 }}>
          Tips CV, persiapan interview, dan wawasan dunia kerja dari tim GradReady.
        </p>
      </div>

      {articles.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 0",
            color: "var(--gray-light)",
            fontWeight: 700,
          }}
        >
          Belum ada artikel. Nantikan tulisan terbaru dari kami!
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 24,
            marginBottom: 48,
          }}
        >
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/blog/${a.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1px solid var(--border-color)",
                  borderRadius: 16,
                  overflow: "hidden",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    aspectRatio: "16/9",
                    background: "var(--bg-gray)",
                    overflow: "hidden",
                  }}
                >
                  {a.coverImage ? (
                    <img
                      src={a.coverImage}
                      alt={a.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--green)",
                        color: "#fff",
                        fontFamily: "'Fredoka One', cursive",
                        fontSize: 32,
                      }}
                    >
                      GR
                    </div>
                  )}
                </div>
                <div style={{ padding: "20px 24px" }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--gray-light)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      marginBottom: 8,
                    }}
                  >
                    {a.publishedAt ? formatDate(a.publishedAt) : ""} ·{" "}
                    {a.author?.name ?? "GradReady"}
                  </p>
                  <h3
                    style={{
                      fontFamily: "'Fredoka One', cursive",
                      fontSize: 20,
                      color: "var(--dark-blue)",
                      marginBottom: 8,
                      lineHeight: 1.3,
                    }}
                  >
                    {a.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--gray-text)",
                      fontWeight: 600,
                      lineHeight: 1.5,
                      margin: 0,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {a.excerpt}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {page > 1 ? (
            <Link
              href={`/blog?page=${page - 1}`}
              style={{
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: 10,
                border: "1px solid var(--border-color)",
                fontWeight: 800,
                fontSize: 14,
                color: "var(--gray-text)",
              }}
            >
              ← Sebelumnya
            </Link>
          ) : (
            <span
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "1px solid var(--border-color)",
                fontWeight: 800,
                fontSize: 14,
                color: "var(--gray-light)",
                cursor: "not-allowed",
              }}
            >
              ← Sebelumnya
            </span>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              const active = p === page;
              return (
                <Link
                  key={p}
                  href={`/blog?page=${p}`}
                  style={{
                    textDecoration: "none",
                    width: 36,
                    height: 36,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    fontWeight: 800,
                    fontSize: 14,
                    background: active ? "var(--green)" : "transparent",
                    color: active ? "#fff" : "var(--gray-text)",
                    border: active
                      ? "2px solid var(--green-shadow)"
                      : "1px solid var(--border-color)",
                  }}
                >
                  {p}
                </Link>
              );
            })}
          </div>

          {page < totalPages ? (
            <Link
              href={`/blog?page=${page + 1}`}
              style={{
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: 10,
                border: "1px solid var(--border-color)",
                fontWeight: 800,
                fontSize: 14,
                color: "var(--gray-text)",
              }}
            >
              Selanjutnya →
            </Link>
          ) : (
            <span
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: "1px solid var(--border-color)",
                fontWeight: 800,
                fontSize: 14,
                color: "var(--gray-light)",
                cursor: "not-allowed",
              }}
            >
              Selanjutnya →
            </span>
          )}
        </div>
      )}
    </div>
  );
}
