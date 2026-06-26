import { auth, isAdmin } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const articleSchema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1),
  coverImage: z.string().optional().default(""),
  published: z.boolean().optional().default(false),
});

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { author: { select: { name: true } } },
  });

  return NextResponse.json({ articles });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const parsed = articleSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const { title, excerpt, content, coverImage, published } = parsed.data;

  // Ensure unique slug (append short suffix on collision).
  let slug = slugify(title) || "artikel";
  if (await prisma.article.findUnique({ where: { slug } })) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  const isPublished = published === true;
  const article = await prisma.article.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || null,
      authorId: session!.user.id,
      published: isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  return NextResponse.json({ article }, { status: 201 });
}
