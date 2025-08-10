import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How this site collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  const updated = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  return (
    <main className="mx-auto max-w-[72ch] px-4 py-10">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm opacity-70 hover:opacity-100">
          <span className="rotate-180 select-none">➔</span>
          <span>Back to Home</span>
        </Link>
      </div>
      <header className="mb-6">
        <h1 className="text-3xl font-bold leading-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-black/70 dark:text-white/70">Last updated: {updated}</p>
      </header>

      <article className="prose prose-invert max-w-none">
        <p>
          This website is a personal blog operated by Muhammad Farrel Rabbani. It uses Next.js, NextAuth for
          authentication, and MongoDB for storing comments. By using this site, you agree to this policy.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>
            Account info: If you sign in (e.g., with Google or GitHub), we receive basic profile details such as your
            name, avatar, and email address from the provider.
          </li>
          <li>
            Content you submit: Comments you post (including any replies) tied to the article slug and your account.
          </li>
          <li>
            Technical data: Basic server logs (IP address, user agent, timestamps) to operate and secure the site.
          </li>
        </ul>

        <h2>How We Use Information</h2>
        <ul>
          <li>To display your comments and associate them with your account.</li>
          <li>To provide sign-in functionality and protect against abuse.</li>
          <li>To operate, maintain, and improve the site.</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          We use essential cookies for authentication sessions via NextAuth. These cookies keep you signed in and are
          required for commenting. You can clear or block cookies in your browser, but some features may not work.
        </p>

        <h2>Comments Storage</h2>
        <p>
          Comments are stored in MongoDB (hosted by MongoDB Atlas). In some deployments, the MongoDB Atlas Data API may
          be used. Your display name and avatar (from your provider) may appear next to your comments.
        </p>

        <h2>Advertising</h2>
        <p>
          Blog post pages may load third‑party ad scripts. These providers may use cookies or similar technologies and
          collect data such as IP address and user agent to deliver and measure ads. Your interactions with these
          services are governed by their own privacy policies. You can use your browser settings or ad preferences to
          manage tracking.
        </p>

        <h2>Data Sharing</h2>
        <p>
          We do not sell your personal information. We may share data with service providers (e.g., hosting and database
          providers) solely to operate the site. We may disclose information if required by law or to protect our rights.
        </p>

        <h2>Data Retention</h2>
        <p>
          Comments may be retained indefinitely to preserve conversation context. You can request removal of your own
          comments; we’ll delete them where reasonably possible.
        </p>

        <h2>Your Choices</h2>
        <ul>
          <li>You can sign out at any time. Session cookies will then expire or be cleared.</li>
          <li>You may request deletion of your comments.</li>
          <li>You can block cookies in your browser (some features may stop working).</li>
        </ul>

        <h2>Children</h2>
        <p>This site isn’t directed to children under 13 and doesn’t knowingly collect their personal information.</p>

        <h2>Contact</h2>
        <p>
          Questions? Reach out via <a href="mailto:farrelrabbani88@gmail.com">email</a> or visit the {""}
          <Link href="/">home page</Link> for more ways to get in touch.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy from time to time. Material changes will be reflected on this page with an updated
          date.
        </p>
      </article>
    </main>
  );
}
