import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { assertFeatureQuota, consumeCredit } from "@/lib/billing";
import { handleApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

// Called by cv-builder before allowing PDF download. Assert + consume CV_GENERATE quota.
export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sub = await assertFeatureQuota(session.user.id, "CV_GENERATE");
    await consumeCredit(session.user.id, "CV_GENERATE", sub);

    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
