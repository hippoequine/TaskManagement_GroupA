import { describe, it, expect, beforeEach } from 'vitest';
import {
  getRoles,
  hasRole,
  hasAnyRole,
  hasAllRoles,
} from '../auth/authHelpers';

describe('authHelpers', () => {
  let adminUser;
  let clinicianUser;
  let developerUser;
  let allRolesUser;
  let emptyUser;
  let nullUser;

  beforeEach(() => {
    adminUser = { roles: ['admin'] };
    clinicianUser = { roles: ['clinician'] };
    developerUser = { roles: ['developer'] };
    allRolesUser = { roles: ['admin', 'clinician', 'developer'] };
    emptyUser = { roles: [] };
    nullUser = null;
  });

  //TEST: getRoles
  describe('getRoles', () => {
    it('returns the user role(s) (roles array) if user has roles', () => {
      expect(getRoles(adminUser)).toEqual(['admin']);
      expect(getRoles(clinicianUser)).toEqual(['clinician']);
      expect(getRoles(developerUser)).toEqual(['developer']);
      expect(getRoles(allRolesUser)).toEqual([
        'admin',
        'clinician',
        'developer',
      ]);
    });

    it('returns empty array if user has no roles or user is null', () => {
      expect(getRoles(emptyUser)).toEqual([]);
      expect(getRoles(nullUser)).toEqual([]);
    });
  });

  //TEST: hasRole
  describe('hasRole', () => {
    it('returns true if user has the role', () => {
      expect(hasRole(adminUser, 'admin')).toBe(true);
      expect(hasRole(clinicianUser, 'clinician')).toBe(true);
      expect(hasRole(developerUser, 'developer')).toBe(true);
      expect(hasRole(allRolesUser, 'admin')).toBe(true);
      expect(hasRole(allRolesUser, 'clinician')).toBe(true);
      expect(hasRole(allRolesUser, 'developer')).toBe(true);
    });

    it('returns false if user does not have the role', () => {
      expect(hasRole(emptyUser, 'admin')).toBe(false);
      expect(hasRole(nullUser, 'admin')).toBe(false);
      expect(hasRole(allRolesUser, 'manager')).toBe(false);
      expect(hasRole(clinicianUser, 'admin')).toBe(false);
    });
  });

  //TEST: hasAnyRole
  describe('hasAnyRole', () => {
    it('returns true if user has at least one role from the list', () => {
      expect(hasAnyRole(adminUser, ['admin', 'clinician'])).toBe(true);
      expect(hasAnyRole(clinicianUser, ['clinician', 'developer'])).toBe(true);
      expect(hasAnyRole(developerUser, ['admin', 'developer'])).toBe(true);
      expect(hasAnyRole(allRolesUser, ['admin', 'clinician'])).toBe(true);
    });

    it('returns false if user has none of the roles', () => {
      expect(hasAnyRole(nullUser, ['admin'])).toBe(false);
      expect(hasAnyRole(emptyUser, ['clinician'])).toBe(false);
      expect(hasAnyRole(adminUser, ['developer', 'clinician'])).toBe(false);
    });
  });

  //TEST: hasAllRoles
  describe('hasAllRoles', () => {
    it('returns true if user has all the required roles', () => {
      expect(
        hasAllRoles(allRolesUser, ['admin', 'clinician', 'developer'])
      ).toBe(true);
      expect(hasAllRoles(adminUser, ['admin'])).toBe(true);
      expect(hasAllRoles(clinicianUser, ['clinician'])).toBe(true);
      expect(hasAllRoles(developerUser, ['developer'])).toBe(true);
    });

    it('returns false if user is missing the required role', () => {
      expect(hasAllRoles(allRolesUser, ['manager'])).toBe(false);
      expect(hasAllRoles(adminUser, ['admin', 'clinician'])).toBe(false);
      expect(hasAllRoles(emptyUser, ['admin'])).toBe(false);
      expect(hasAllRoles(nullUser, ['clinician'])).toBe(false);
    });
  });
});
