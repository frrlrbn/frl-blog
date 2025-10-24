export default function AuthError() {
  return (
    <main className="mx-auto max-w-[72ch] px-4 py-20 text-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Authentication Error</h1>
        <p className="text-lg opacity-70">
          You have exceeded the maximum number of login attempts for today.
        </p>
        <p className="text-sm opacity-60">
          Please try again tomorrow or contact support if you believe this is an error.
        </p>
        <div className="pt-6">
          <a
            href="/"
            className="inline-block px-6 py-3 text-sm rounded-lg border border-black/15 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            Go Back Home
          </a>
        </div>
      </div>
    </main>
  );
}
