import { getDb, getMongoClient } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { checkCommentRateLimit, isAdmin } from "@/lib/rateLimit";
import { filterBadWords, containsBadWords } from "@/lib/wordFilter";

// Ensure serverless Node.js runtime and disable caching on Vercel
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return Response.json({ comments: [] });
  try {
  const db = await getDb();
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
  
  // Rate limiting check
  const user = session!.user as any;
  const userId = user?.id || user?.email || "unknown";
  
  const rateLimit = checkCommentRateLimit(userId);
  if (!rateLimit.allowed) {
    const resetDate = new Date(rateLimit.resetAt).toLocaleString();
    return new Response(
      JSON.stringify({ 
        error: "Rate limit exceeded", 
        message: `You have reached the maximum number of comments per day. Please try again after ${resetDate}.`,
        resetAt: rateLimit.resetAt 
      }), 
      { 
        status: 429,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  
  const body = await req.json();
  const { slug, content, parentId } = body ?? {};
  if (!slug || !content?.trim()) return new Response("Bad Request", { status: 400 });
  const trimmed = String(content).trim();
  if (trimmed.length > 500) return new Response("Content too long", { status: 413 });
  
  // Filter bad words from content
  const filteredContent = filterBadWords(trimmed);
  
  // Log if bad words were detected (optional, for monitoring)
  if (containsBadWords(trimmed)) {
    console.log(`Bad words detected in comment from user ${userId}`);
  }
  
  const parent = parentId ? (() => { try { return new ObjectId(parentId); } catch { return null; } })() : null;
  // Guard: only allow replies to root comments (i.e., parent has no parentId)
  if (parent) {
    try {
  const db = await getDb();
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
    content: filteredContent, // Use filtered content instead of trimmed
    createdAt: new Date(),
    author: {
      id: user?.id || user?.email || "unknown",
      name: user?.name ?? null,
      image: user?.image ?? null,
    },
    ...(parent ? { parentId: parent } : {}),
  };
  try {
  const db = await getDb();
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
  const db = await getDb();
    const doc = await db.collection("comments").findOne({ _id });
    if (!doc) return new Response("Not Found", { status: 404 });
    
    const sessionId = user?.id || user?.email;
    const userEmail = user?.email;
    
    // Check if user is admin or the comment owner
    const isOwner = sessionId && doc.author?.id === sessionId;
    const hasAdminPrivilege = isAdmin(userEmail);
    
    if (!isOwner && !hasAdminPrivilege) {
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
