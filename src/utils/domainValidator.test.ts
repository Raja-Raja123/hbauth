/// <reference types="jest" />

/**
 * Domain Validator Unit Tests
 */

import {
  validateDomain,
  getDomainFromEmail,
  isFromAllowedDomain,
  parseAllowedEmails,
  isAllowedTestEmail,
} from './domainValidator';

describe('Domain Validator', () => {
  describe('validateDomain', () => {
    it('should return true for valid hbplus.fit emails', () => {
      expect(validateDomain('user@hbplus.fit')).toBe(true);
      expect(validateDomain('admin@hbplus.fit')).toBe(true);
      expect(validateDomain('john.doe@hbplus.fit')).toBe(true);
    });

    it('should return true case-insensitively', () => {
      expect(validateDomain('USER@HBPLUS.FIT')).toBe(true);
      expect(validateDomain('User@HbPlus.Fit')).toBe(true);
    });

    it('should return false for invalid domains', () => {
      expect(validateDomain('user@gmail.com')).toBe(false);
      expect(validateDomain('user@yahoo.com')).toBe(false);
      expect(validateDomain('user@hbplus.com')).toBe(false);
      expect(validateDomain('user@fakehbplus.fit')).toBe(false);
    });

    it('should allow the configured dev-only test email without allowing other Gmail accounts', () => {
      const allowedEmails = parseAllowedEmails(
        ' other@example.com, KSHIRODBISWAL208@GMAIL.COM '
      );

      expect(isAllowedTestEmail('  kshirodbiswal208@gmail.com ', allowedEmails)).toBe(true);
      expect(isAllowedTestEmail('someone@gmail.com', allowedEmails)).toBe(false);
    });

    it('should handle invalid inputs gracefully', () => {
      expect(validateDomain('')).toBe(false);
      expect(validateDomain(null as unknown as string)).toBe(false);
      expect(validateDomain(undefined as unknown as string)).toBe(false);
      expect(validateDomain('invalid-email')).toBe(false);
    });
  });

  describe('getDomainFromEmail', () => {
    it('should extract domain correctly', () => {
      expect(getDomainFromEmail('test@hbplus.fit')).toBe('hbplus.fit');
      expect(getDomainFromEmail('TEST@GMAIL.COM')).toBe('gmail.com');
    });

    it('should return null for invalid email format', () => {
      expect(getDomainFromEmail('invalid')).toBeNull();
      expect(getDomainFromEmail('')).toBeNull();
    });
  });

  describe('isFromAllowedDomain', () => {
    it('should check against allowed domains list', () => {
      const allowed = ['hbplus.fit', 'partner.org'];
      expect(isFromAllowedDomain('user@hbplus.fit', allowed)).toBe(true);
      expect(isFromAllowedDomain('user@partner.org', allowed)).toBe(true);
      expect(isFromAllowedDomain('user@gmail.com', allowed)).toBe(false);
    });
  });
});
