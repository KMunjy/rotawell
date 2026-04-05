import { describe, it, expect } from 'vitest';
import { AVATAR_CONFIG } from '@/lib/avatar-config';

describe('Avatar configuration', () => {
  it('has a valid avatar ID', () => {
    expect(AVATAR_CONFIG.avatarId).toBeTruthy();
    expect(typeof AVATAR_CONFIG.avatarId).toBe('string');
  });

  it('has a system prompt with UK healthcare context', () => {
    const prompt = AVATAR_CONFIG.systemPrompt;
    expect(prompt).toContain('Rotawell');
    expect(prompt).toContain('UK');
    expect(prompt).toContain('British English');
  });

  it('system prompt includes safety boundaries', () => {
    const prompt = AVATAR_CONFIG.systemPrompt;
    expect(prompt).toContain('Never provide medical diagnosis');
    expect(prompt).toContain('clinical advice');
  });

  it('has a greeting message', () => {
    expect(AVATAR_CONFIG.greeting).toBeTruthy();
    expect(AVATAR_CONFIG.greeting).toContain('Rotawell');
  });

  it('has a fallback response', () => {
    expect(AVATAR_CONFIG.fallbackResponse).toBeTruthy();
  });

  it('has a clinical safety response', () => {
    expect(AVATAR_CONFIG.clinicalSafetyResponse).toBeTruthy();
    expect(AVATAR_CONFIG.clinicalSafetyResponse).toContain('healthcare professional');
  });

  it('has valid session timeout values', () => {
    expect(AVATAR_CONFIG.sessionTimeoutMs).toBe(10 * 60 * 1000);
    expect(AVATAR_CONFIG.warningBeforeMs).toBe(2 * 60 * 1000);
    expect(AVATAR_CONFIG.sessionTimeoutMs).toBeGreaterThan(AVATAR_CONFIG.warningBeforeMs);
  });

  it('SDK config has sensible defaults', () => {
    expect(AVATAR_CONFIG.sdkConfig.quality).toBe('medium');
    expect(AVATAR_CONFIG.sdkConfig.language).toBe('en');
  });
});
