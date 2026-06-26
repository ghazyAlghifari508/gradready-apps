import { auth, isAdmin } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const resourcePatchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  url: z.string().url().max(500).optional(),
  platform: z.string().min(1).max(100).optional(),
  durationWeeks: z.coerce.number().int().positive().optional(),
  isFree: z.boolean().optional(),
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
  const parsed = resourcePatchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload", issues: parsed.error.issues }, { status: 400 });
  }
  const body = parsed.data;

  const resource = await prisma.learningResource.update({
    where: { id },
    data: {
      title: body.title,
      url: body.url,
      platform: body.platform,
      durationWeeks: body.durationWeeks ? Number(body.durationWeeks) : null,
      isFree: body.isFree !== false,
    },
  });

  return NextResponse.json({ resource });
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
  await prisma.learningResource.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
