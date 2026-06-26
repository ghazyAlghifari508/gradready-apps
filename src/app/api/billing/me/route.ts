import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getFeatureUsageSummary } from "@/lib/billing";
import { handleApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const usage = await getFeatureUsageSummary(session.user.id);
    return NextResponse.json(usage);
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
