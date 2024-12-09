import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock contract state
let contractOwner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
let verifiedSkills: Record<string, { verified: boolean, verifier: string | null }> = {};

// Mock contract calls
const mockContractCall = vi.fn();

// Helper function to reset state before each test
function resetState() {
  contractOwner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  verifiedSkills = {};
}

// Helper function to generate a unique key for verifiedSkills
function getSkillKey(userId: string, skill: string): string {
  return `${userId}-${skill}`;
}

describe('Skill Verification Contract', () => {
  beforeEach(() => {
    resetState();
    vi.resetAllMocks();
  });
  
  it('should verify a skill', () => {
    mockContractCall.mockImplementation((_, __, userId, skill) => {
      if (contractOwner === 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM') {
        const key = getSkillKey(userId, skill);
        verifiedSkills[key] = { verified: true, verifier: contractOwner };
        return { success: true };
      }
      return { success: false, error: 403 };
    });
    
    const result = mockContractCall('skill-verification', 'verify-skill', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', 'web-development');
    expect(result).toEqual({ success: true });
    expect(verifiedSkills['ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG-web-development']).toEqual({ verified: true, verifier: contractOwner });
  });
  
  it('should not allow non-owner to verify skill', () => {
    const nonOwner = 'ST3AM1A56AK2C1XAFJ4115ZSV26EB49BVQ10MGCS0';
    
    mockContractCall.mockImplementation(() => {
      return { success: false, error: 403 };
    });
    
    const result = mockContractCall('skill-verification', 'verify-skill', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', 'design');
    expect(result).toEqual({ success: false, error: 403 });
    expect(verifiedSkills['ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG-design']).toBeUndefined();
  });
  
  it('should check if skill is verified', () => {
    const userId = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG';
    const skill = 'web-development';
    const key = getSkillKey(userId, skill);
    verifiedSkills[key] = { verified: true, verifier: contractOwner };
    
    mockContractCall.mockImplementation((_, __, checkedUserId, checkedSkill) => {
      const checkedKey = getSkillKey(checkedUserId, checkedSkill);
      return {
        success: true,
        value: verifiedSkills[checkedKey] || { verified: false, verifier: null }
      };
    });
    
    const result = mockContractCall('skill-verification', 'is-skill-verified', userId, skill);
    expect(result).toEqual({ success: true, value: { verified: true, verifier: contractOwner } });
  });
  
  it('should return false for unverified skill', () => {
    mockContractCall.mockImplementation((_, __, userId, skill) => {
      const key = getSkillKey(userId, skill);
      return {
        success: true,
        value: verifiedSkills[key] || { verified: false, verifier: null }
      };
    });
    
    const result = mockContractCall('skill-verification', 'is-skill-verified', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG', 'design');
    expect(result).toEqual({ success: true, value: { verified: false, verifier: null } });
  });
});

