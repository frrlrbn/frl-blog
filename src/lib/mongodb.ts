// Use dynamic import types to avoid compile errors when package not yet installed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let MongoClient: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  MongoClient = require("mongodb").MongoClient;
} catch {
  MongoClient = class {};
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.warn("MONGODB_URI is not set. Database features will be disabled until configured.");
}

// In serverless, cache the client across invocations to prevent creating too many connections
const g = globalThis as unknown as {
  _mongoClient?: any | null;
  _mongoPromise?: Promise<any> | null;
};

let client: any | null = g._mongoClient ?? null;
let promise: Promise<any> | null = g._mongoPromise ?? null;

export function getMongoClient(): Promise<any> {
  if (client) return Promise.resolve(client);
  if (!promise) {
    if (!uri) throw new Error("Missing MONGODB_URI env.");
    // Prefer stable Atlas defaults and explicit TLS
    const opts: any = {
      // Use Stable API for Atlas
      serverApi: { version: "1", strict: false, deprecationErrors: false },
      // TLS is implicit for mongodb+srv, but set true explicitly for clarity
      tls: true,
      // Conservative pool for serverless
      maxPoolSize: 5,
      minPoolSize: 0,
      // Faster failover when network is blocked
      serverSelectionTimeoutMS: 8000,
      appName: process.env.MONGODB_APP_NAME || "frl-blog",
    };
    if (process.env.MONGODB_TLS_INSECURE === "1") {
            opts.tlsAllowInvalidCertificates = true;
    }
    promise = new MongoClient(uri, opts).connect().then((c: any) => {
      g._mongoClient = c;
      client = c;
      return c;
    });
    g._mongoPromise = promise;
  }
  return promise!;
}

export async function getDb(name?: string): Promise<any> {
  const client = await getMongoClient();
  const dbName = name || process.env.MONGODB_DB_NAME || process.env.MONGODB_DB || "blog";
  return client.db(dbName);
}

export async function pingDb(): Promise<{ ok: boolean; error?: string }> {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || String(e) };
  }
}

export type CommentDoc = {
  _id?: any;
  slug: string;
  content: string;
  createdAt: Date;
  author: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
};
