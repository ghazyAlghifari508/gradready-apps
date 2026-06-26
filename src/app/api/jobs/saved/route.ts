import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { JobStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { apiError, handleApiError } from "@/lib/errors";
import { savedJobSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

export async function GET(_req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedJobs = await prisma.savedJob.findMany({
      where: { userId: session.user.id },
      orderBy: { savedAt: "desc" },
    });

    return NextResponse.json({ success: true, savedJobs });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = savedJobSchema.safeParse(
      await req.json().catch(() => undefined),
    );
    if (!validation.success) {
      return apiError(400, "INVALID_PAYLOAD", validation.error.issues);
    }

    const { id, companyName, position, status, notes } = validation.data;

    if (id) {
      const updated = await prisma.savedJob.update({
        where: { id, userId: session.user.id }, // ENSURE security
        data: {
          status: status,
          notes: notes,
        },
      });
      return NextResponse.json({ success: true, savedJob: updated });
    }

    if (!companyName || !position) {
      return apiError(400, "INVALID_PAYLOAD", [
        { path: ["companyName", "position"], message: "Missing required fields" },
      ]);
    }

    const newJob = await prisma.savedJob.create({
      data: {
        userId: session.user.id,
        companyName,
        position,
        notes: notes ?? "",
        status: JobStatus.SAVED,
      },
    });

    return NextResponse.json({ success: true, savedJob: newJob });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.savedJob.delete({
      where: { id, userId: session.user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
