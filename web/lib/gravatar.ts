import crypto from 'crypto';

/**
 * Generate a Gravatar URL for a given email.
 *
 * @param email The user’s email address.
 * @param size  Image size in pixels (default 200).
 * @returns Gravatar image URL.
 */
export function getGravatarUrl(email: string, size: number = 200): string {
  const normalized = email.trim().toLowerCase();
  const hash = crypto.createHash('md5').update(normalized).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}
