import { pingDb } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const res = await pingDb();
  const status = res.ok ? 200 : 500;
  return Response.json({
    ok: res.ok,
    error: res.error,
    env: {
      hasUri: Boolean(process.env.MONGODB_URI),
      dbName: process.env.MONGODB_DB_NAME || process.env.MONGODB_DB || "blog",
    },
  }, { status });
}
