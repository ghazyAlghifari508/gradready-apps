import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { 
      name, 
      university, 
      graduationYear, 
      bio, 
      linkedinUrl, 
      githubUrl, 
      phone,
      targetJobId
    } = body;

    // Update User Name
    if (name && name !== session.user.name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name }
      });
    }

    // Update Profile
    const profile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        university,
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
        bio,
        linkedinUrl,
        githubUrl,
        phone,
        targetJobId
      },
      create: {
        userId: session.user.id,
        university,
        graduationYear: graduationYear ? parseInt(graduationYear, 10) : null,
        bio,
        linkedinUrl,
        githubUrl,
        phone,
        targetJobId
      }
    });

    // If targetJobRole changes, we might need to recalculate or reset skill gap. 
    // The PRD mentions "akan reset skill gap". We can delete the current skill gap.
    const currentGap = await prisma.skillGap.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" }
    });

    if (currentGap && targetJobId && currentGap.jobRoleId !== targetJobId) {
       await prisma.skillGap.delete({ where: { id: currentGap.id } });
       // The next time they use CV Analyzer it will generate a new gap for the new role.
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("Profile Update Error", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
