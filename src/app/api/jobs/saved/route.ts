import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { JobStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
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
  } catch (error: any) {
    console.error("GET Saved Jobs API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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

    const body = await req.json();
    const { id, companyName, position, status, notes } = body;

    // IF ID exists, it's an update
    if (id) {
       const updated = await prisma.savedJob.update({
         where: { id, userId: session.user.id }, // ENSURE security
         data: {
           status: status,
           notes: notes
         }
       });
       return NextResponse.json({ success: true, savedJob: updated });
    }

    // ELSE, create new saved job
    if (!companyName || !position) {
       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newJob = await prisma.savedJob.create({
      data: {
        userId: session.user.id,
        companyName,
        position,
        notes: notes || "",
        status: JobStatus.SAVED,
      }
    });

    return NextResponse.json({ success: true, savedJob: newJob });

  } catch (error: any) {
    console.error("POST Saved Jobs API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
       where: { id, userId: session.user.id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE Saved Jobs API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
