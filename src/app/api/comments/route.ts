import { getMongoClient } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return Response.json({ comments: [] });
  try {
    const client = await getMongoClient();
    const db = client.db();
    const docs = await db.collection("comments").find({ slug }).sort({ createdAt: 1 }).toArray();
    // Serialize ObjectIds and Dates for the client
    const comments = docs.map((d: any) => ({
      _id: d._id?.toString?.() ?? d._id,
      slug: d.slug,
      content: d.content,
      createdAt: (d.createdAt instanceof Date ? d.createdAt : new Date(d.createdAt)).toISOString(),
      author: d.author,
      parentId: d.parentId ? d.parentId.toString?.() : undefined,
    }));
    return Response.json({ comments });
  } catch (e) {
    console.error(e);
    return Response.json({ comments: [] });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email && !(session?.user as any)?.id) {
    return new Response("Unauthorized", { status: 401 });
  }
  const body = await req.json();
  const { slug, content, parentId } = body ?? {};
  if (!slug || !content?.trim()) return new Response("Bad Request", { status: 400 });
  const trimmed = String(content).trim();
  if (trimmed.length > 500) return new Response("Content too long", { status: 413 });
  // At this point session is guaranteed by the guard above
  const user = session!.user as any;
  const parent = parentId ? (() => { try { return new ObjectId(parentId); } catch { return null; } })() : null;
  // Guard: only allow replies to root comments (i.e., parent has no parentId)
  if (parent) {
    try {
      const client = await getMongoClient();
      const db = client.db();
      const p = await db.collection("comments").findOne({ _id: parent });
      if (!p) return new Response("Parent Not Found", { status: 404 });
      if (p.parentId) return new Response("Replies to replies are not allowed", { status: 400 });
    } catch (e) {
      console.error(e);
      return new Response("Server Error", { status: 500 });
    }
  }
  const doc = {
    slug,
  content: trimmed,
    createdAt: new Date(),
    author: {
      id: user?.id || user?.email || "unknown",
      name: user?.name ?? null,
      image: user?.image ?? null,
    },
    ...(parent ? { parentId: parent } : {}),
  };
  try {
    const client = await getMongoClient();
    const db = client.db();
    await db.collection("comments").insertOne(doc);
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return new Response("Server Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email && !(session?.user as any)?.id) {
    return new Response("Unauthorized", { status: 401 });
  }
  const user = session!.user as any;
  const body = await req.json().catch(() => null);
  const { id } = body ?? {};
  if (!id) return new Response("Bad Request", { status: 400 });
  let _id: any;
  try {
    _id = new ObjectId(id);
  } catch {
    return new Response("Bad Request", { status: 400 });
  }
  try {
    const client = await getMongoClient();
    const db = client.db();
    const doc = await db.collection("comments").findOne({ _id });
    if (!doc) return new Response("Not Found", { status: 404 });
    const sessionId = user?.id || user?.email;
    if (!sessionId || doc.author?.id !== sessionId) {
      return new Response("Forbidden", { status: 403 });
    }
    await db.collection("comments").deleteOne({ _id });
    // Optionally cascade delete replies
    await db.collection("comments").deleteMany({ parentId: _id });
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return new Response("Server Error", { status: 500 });
  }
}
