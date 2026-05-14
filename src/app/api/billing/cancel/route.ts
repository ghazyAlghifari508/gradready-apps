import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.subscription.updateMany({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        periodEnd: { gt: new Date() },
      },
      data: { status: "CANCELED" },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
