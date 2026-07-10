import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Not authorized" }, { status: 403 });

  const { publicId } = await req.json();
  if (!publicId) return NextResponse.json({ error: "Missing publicId" }, { status: 400 });

  await deleteCloudinaryAsset(publicId);
  return NextResponse.json({ success: true });
}
