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

let client: any | null = null;
let promise: Promise<any> | null = null;

export function getMongoClient(): Promise<any> {
  if (client) return Promise.resolve(client);
  if (!promise) {
    if (!uri) throw new Error("Missing MONGODB_URI env.");
  promise = new MongoClient(uri).connect().then((c: any) => {
      client = c;
      return c;
    });
  }
  return promise!;
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
