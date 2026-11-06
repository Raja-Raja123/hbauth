/**
 * Email domain validation utilities
 */

/**
 * Validates if an email belongs to the allowed domain (@hbplus.fit)
 * @param email - The email address to validate
 * @returns true if email is allowed, false otherwise
 */
export const parseAllowedEmails = (value: string | undefined): string[] =>
  (value ?? '')
    .split(',')
    .map((allowedEmail) => allowedEmail.trim().toLowerCase())
    .filter(Boolean);

export const isAllowedTestEmail = (email: string, allowedEmails: string[]): boolean =>
  allowedEmails.includes(email.trim().toLowerCase());

export const validateDomain = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const allowedDomain = 'hbplus.fit';
  const emailDomain = normalizedEmail.split('@')[1];
  const testAllowedEmails = parseAllowedEmails(process.env.EXPO_PUBLIC_TEST_ALLOWED_EMAILS);
  const isTestEmailAllowed = isAllowedTestEmail(normalizedEmail, testAllowedEmails);

  return emailDomain === allowedDomain || isTestEmailAllowed;
};

/**
 * Gets the domain portion from an email address
 * @param email - The email address
 * @returns The domain portion or null if invalid
 */
export const getDomainFromEmail = (email: string): string | null => {
  if (!email || typeof email !== 'string') {
    return null;
  }

  const parts = email.toLowerCase().split('@');
  return parts.length === 2 ? parts[1] : null;
};

/**
 * Checks if an email is from a list of allowed domains
 * @param email - The email address
 * @param allowedDomains - Array of allowed domains
 * @returns true if email is from an allowed domain
 */
export const isFromAllowedDomain = (
  email: string,
  allowedDomains: string[]
): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const emailDomain = email.toLowerCase().split('@')[1];
  return emailDomain ? allowedDomains.includes(emailDomain) : false;
};
