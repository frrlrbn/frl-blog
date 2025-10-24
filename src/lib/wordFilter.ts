// Word filter utility for censoring blacklisted words in comments

/**
 * Get blacklisted words from environment variable
 */
function getBlacklistedWords(): string[] {
  const blacklist = process.env.COMMENT_BLACKLIST || "";
  return blacklist
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word.length > 0);
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // Remove all non-alphanumeric
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b")
    .replace(/ø|°|ο/g, "o")
    .replace(/í|ì|î|ï|ĩ|ī|į|İ|ı|ℓ/g, "i")
    .replace(/€|é|è|ê|ë|ē|ė|ę/g, "e")
    .replace(/á|à|â|ä|ã|å|ā|æ/g, "a")
    .replace(/§|ś|ŝ|š|ş/g, "s")
    .replace(/†|ť|ţ/g, "t")
    .replace(/ß|β/g, "b")
    .replace(/ú|ù|û|ü|ũ|ū|ů|ų/g, "u")
    .replace(/đ|ď/g, "d")
    .replace(/ν|ѵ/g, "v")
    .replace(/ŕ|ř/g, "r")
    .replace(/ý|ÿ/g, "y")
    .replace(/ƒ/g, "f");
}

/**
 * Censor a matched word by replacing each character with asterisk
 */
function censorWord(word: string): string {
  return "*".repeat(word.length);
}

/**
 * Filter and censor blacklisted words in content
 * Returns the censored content
 */
export function filterBadWords(content: string): string {
  const blacklist = getBlacklistedWords();
  if (blacklist.length === 0) return content;

  let filtered = content;

  // Sort blacklist by length (longest first) to match longer phrases before shorter ones
  const sortedBlacklist = blacklist
    .map((word) => ({
      original: word,
      normalized: normalizeText(word),
    }))
    .sort((a, b) => b.normalized.length - a.normalized.length);

  // Find all potential matches in the content
  for (const { normalized } of sortedBlacklist) {
    if (normalized.length === 0) continue;

    const pattern = normalized
      .split("")
      .map((char) => {
        // Map normalized chars back to possible variants
        if (char === "o") return "[o0Ø°ο]";
        if (char === "i") return "[i1!|líìîïĩīįİıℓ]";
        if (char === "e") return "[e3€éèêëēėę]";
        if (char === "a") return "[a4@áàâäãåāæ]";
        if (char === "s") return "[s5$§śŝšş]";
        if (char === "t") return "[t7+†ťţ]";
        if (char === "b") return "[b8ßβ]";
        if (char === "u") return "[uúùûüũūůų]";
        if (char === "d") return "[dđď]";
        if (char === "v") return "[vνѵ]";
        if (char === "m") return "[m]";
        if (char === "r") return "[rŕř]";
        if (char === "y") return "[yýÿ]";
        if (char === "f") return "[fƒ]";
        return char;
      })
      .join("[^a-zA-Z0-9]*"); // Allow any non-alphanumeric between chars

    const regex = new RegExp(pattern, "gi");

    // Replace matches with asterisks
    filtered = filtered.replace(regex, (match) => censorWord(match));
  }

  return filtered;
}

/**
 * Check if content contains any blacklisted words (for logging/monitoring)
 */
export function containsBadWords(content: string): boolean {
  const blacklist = getBlacklistedWords();
  if (blacklist.length === 0) return false;

  const normalizedContent = normalizeText(content);

  return blacklist.some((word) => {
    const normalized = normalizeText(word);
    return normalizedContent.includes(normalized);
  });
}
