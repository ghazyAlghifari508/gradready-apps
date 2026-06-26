import { auth, isAdmin } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const articlePatchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  excerpt: z.string().min(1).max(500).optional(),
  content: z.string().min(1).optional(),
  coverImage: z.string().optional(),
  published: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const parsed = articlePatchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const body = parsed.data;

  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const isPublished = body.published === true;
  const article = await prisma.article.update({
    where: { id },
    data: {
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage || null,
      published: isPublished,
      // Stamp publishedAt the first time it goes live; keep original otherwise.
      publishedAt: isPublished ? (existing.publishedAt ?? new Date()) : null,
    },
  });

  return NextResponse.json({ article });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.article.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
