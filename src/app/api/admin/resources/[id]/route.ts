import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// PATCH: Update a learning resource
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

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

// DELETE: Remove a learning resource
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.learningResource.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
