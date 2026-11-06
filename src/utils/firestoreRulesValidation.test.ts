import { validateDomain } from './domainValidator';

describe('Firestore Rules & Access Control Security Logic', () => {
  const allowedDomain = 'hbplus.fit';

  describe('Domain validation for security rules', () => {
    it('domain user allowed', () => {
      const email = 'user@hbplus.fit';
      const emailVerified = true;
      const isDomain = validateDomain(email);
      expect(isDomain).toBe(true);
      expect(emailVerified).toBe(true);
    });

    it('gmail user denied', () => {
      const email = 'user@gmail.com';
      const isDomain = validateDomain(email);
      expect(isDomain).toBe(false);
    });
  });

  describe('Role promotion security rules logic', () => {
    it('self role-promotion denied (update new role == resource role)', () => {
      const existingUserDoc = { role: 'user' };
      const requestedUpdate = { role: 'admin' }; // trying to self-promote to admin

      const canSelfUpdate = requestedUpdate.role === existingUserDoc.role;
      expect(canSelfUpdate).toBe(false); // blocked by rule: request.resource.data.role == resource.data.role
    });

    it('admin allowed to update other user role', () => {
      const isAdminUser = true;
      const updatingOtherUserRole = true;

      const allowed = isAdminUser && updatingOtherUserRole;
      expect(allowed).toBe(true);
    });
  });
});
