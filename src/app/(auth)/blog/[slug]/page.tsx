import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, published: true },
    select: { title: true, excerpt: true },
  });
  if (!article) return { title: "Artikel tidak ditemukan - GradReady" };
  return { title: `${article.title} - GradReady`, description: article.excerpt };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, published: true },
    include: { author: { select: { name: true } } },
  });

  if (!article) notFound();

  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px" }}>
      <Link
        href="/blog"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 14,
          fontWeight: 800,
          color: "var(--blue)",
          textDecoration: "none",
          marginBottom: 28,
        }}
      >
        ← Kembali ke Daftar Artikel
      </Link>

      <article>
        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--gray-light)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: 12,
          }}
        >
          {article.publishedAt ? formatDate(article.publishedAt) : ""} ·{" "}
          {article.author?.name ?? "GradReady"}
        </p>
        <h1
          style={{
            fontFamily: "'Fredoka One', cursive",
            fontSize: 36,
            color: "var(--dark-blue)",
            marginBottom: 12,
            lineHeight: 1.2,
          }}
        >
          {article.title}
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "var(--gray-text)",
            fontWeight: 700,
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          {article.excerpt}
        </p>

        {article.coverImage && (
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              marginBottom: 40,
              aspectRatio: "16/9",
              background: "var(--bg-gray)",
            }}
          >
            <img
              src={article.coverImage}
              alt={article.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: 16,
                color: "var(--gray-text)",
                fontWeight: 600,
                lineHeight: 1.8,
                margin: 0,
                whiteSpace: "pre-line",
              }}
            >
              {p}
            </p>
          ))}
        </div>

        <div
          style={{
            marginTop: 56,
            paddingTop: 32,
            borderTop: "1px solid var(--border-color)",
            textAlign: "center",
          }}
        >
          <Link
            href="/blog"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 900,
              fontSize: 14,
              color: "#fff",
              background: "var(--green)",
              padding: "12px 24px",
              borderRadius: 12,
              boxShadow: "0 4px 0 var(--green-shadow)",
            }}
          >
            ← Kembali ke Daftar Artikel
          </Link>
        </div>
      </article>
    </div>
  );
}
