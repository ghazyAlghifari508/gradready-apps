import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const skip = (page - 1) * PAGE_SIZE;

    const where = { published: true };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take: PAGE_SIZE,
        skip,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          publishedAt: true,
          author: { select: { name: true } },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    });
  } catch (error: unknown) {
    console.error("[api:articles:list]", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
