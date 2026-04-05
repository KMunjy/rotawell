import { describe, it, expect } from 'vitest';
import type {
  UserRole,
  SupportTicketCategory,
  ShiftStatus,
  ProfileStatus,
  CredentialType,
  InstantPayStatus,
  NurslyProfile,
  NurslyShift,
  NurlySupportTicket,
} from '@/lib/types';

describe('Type definitions', () => {
  it('SupportTicketCategory includes data_request', () => {
    // Compile-time type check — if data_request is missing from the union,
    // this assignment would fail at build time.
    const category: SupportTicketCategory = 'data_request';
    expect(category).toBe('data_request');
  });

  it('SupportTicketCategory includes all expected values', () => {
    const validCategories: SupportTicketCategory[] = [
      'credential_issue',
      'payment_issue',
      'account_access',
      'shift_dispute',
      'technical_bug',
      'compliance_query',
      'data_request',
      'other',
    ];
    expect(validCategories).toHaveLength(8);
  });

  it('UserRole includes all expected roles', () => {
    const roles: UserRole[] = ['nurse', 'agency_admin', 'agency_staff', 'platform_admin'];
    expect(roles).toHaveLength(4);
  });

  it('ShiftStatus includes all expected statuses', () => {
    const statuses: ShiftStatus[] = [
      'draft', 'open', 'filled', 'in_progress', 'completed', 'cancelled', 'disputed',
    ];
    expect(statuses).toHaveLength(7);
  });

  it('InstantPayStatus includes all expected statuses', () => {
    const statuses: InstantPayStatus[] = ['pending', 'processing', 'completed', 'failed'];
    expect(statuses).toHaveLength(4);
  });

  it('NurslyProfile interface shape is correct', () => {
    const profile: NurslyProfile = {
      id: 'test-id',
      role: 'nurse',
      status: 'active',
      full_name: 'Test User',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };
    expect(profile.id).toBe('test-id');
    expect(profile.role).toBe('nurse');
  });
});
