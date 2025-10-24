import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { checkLoginRateLimit, isAdmin } from "@/lib/rateLimit";

// NextAuth v4 configuration used by the API route handler
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Skip rate limit for admin
      if (isAdmin(user.email)) {
        return true;
      }

      // Check login rate limit based on email
      const identifier = user.email || user.id || "unknown";
      const rateLimit = checkLoginRateLimit(identifier);

      if (!rateLimit.allowed) {
        // Return false to prevent sign in
        console.log(`Login rate limit exceeded for ${identifier}`);
        return false;
      }

      return true;
    },
    async session({ session, token }) {
      // Add user id to session
      if (session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    error: "/auth/error", // Custom error page (optional)
  },
};

// No default export; API route will import { authOptions } and call NextAuth(authOptions)
