// Simple in-memory rate limiter for comments
// In production, consider using Redis or a database for persistence

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const commentLimits = new Map<string, RateLimitEntry>();
const loginAttempts = new Map<string, RateLimitEntry>();

// Cleanup old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of commentLimits.entries()) {
    if (now > entry.resetAt) {
      commentLimits.delete(key);
    }
  }
  for (const [key, entry] of loginAttempts.entries()) {
    if (now > entry.resetAt) {
      loginAttempts.delete(key);
    }
  }
}, 3600000); // 1 hour

export function checkCommentRateLimit(userId: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const key = `comment:${userId}`;
  const entry = commentLimits.get(key);

  // Reset period: 24 hours (86400000 ms)
  const resetPeriod = 86400000;
  // Max comments per day
  const maxComments = 20;

  if (!entry || now > entry.resetAt) {
    // Create new entry
    const resetAt = now + resetPeriod;
    commentLimits.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: maxComments - 1,
      resetAt,
    };
  }

  // Check if limit exceeded
  if (entry.count >= maxComments) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;
  commentLimits.set(key, entry);

  return {
    allowed: true,
    remaining: maxComments - entry.count,
    resetAt: entry.resetAt,
  };
}

export function checkLoginRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const key = `login:${identifier}`;
  const entry = loginAttempts.get(key);

  // Reset period: 24 hours (86400000 ms)
  const resetPeriod = 86400000;
  // Max login attempts per day (lebih dari 1 untuk menghindari UX buruk jika logout tidak sengaja)
  const maxLogins = 5;

  if (!entry || now > entry.resetAt) {
    // Create new entry
    const resetAt = now + resetPeriod;
    loginAttempts.set(key, { count: 1, resetAt });
    return {
      allowed: true,
      remaining: maxLogins - 1,
      resetAt,
    };
  }

  // Check if limit exceeded
  if (entry.count >= maxLogins) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;
  loginAttempts.set(key, entry);

  return {
    allowed: true,
    remaining: maxLogins - entry.count,
    resetAt: entry.resetAt,
  };
}

// Admin email with full privileges
export const ADMIN_EMAIL = "farrelrabbani88@gmail.com";

export function isAdmin(userEmail?: string | null): boolean {
  return userEmail === ADMIN_EMAIL;
}
