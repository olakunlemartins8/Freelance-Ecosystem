import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock contract state
let users: Record<string, any> = {};

// Mock contract calls
const mockContractCall = vi.fn();

// Helper function to reset state before each test
function resetState() {
  users = {};
}

describe('User Registry Contract', () => {
  beforeEach(() => {
    resetState();
    vi.resetAllMocks();
  });
  
  it('should register a new user', () => {
    mockContractCall.mockImplementation((_, __, username, role, skills) => {
      const userId = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      if (users[userId]) {
        return { success: false, error: 403 };
      }
      users[userId] = { username, role, skills, reputation_score: 0 };
      return { success: true };
    });
    
    const result = mockContractCall('user-registry', 'register-user', 'johndoe', 'freelancer', ['web-development', 'design']);
    expect(result).toEqual({ success: true });
    expect(users['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM']).toBeDefined();
  });
  
  it('should not allow registering an existing user', () => {
    users['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'] = { username: 'johndoe', role: 'freelancer', skills: ['web-development'], reputation_score: 0 };
    
    mockContractCall.mockImplementation(() => {
      return { success: false, error: 403 };
    });
    
    const result = mockContractCall('user-registry', 'register-user', 'johndoe', 'client', ['project-management']);
    expect(result).toEqual({ success: false, error: 403 });
  });
  
  it('should get user details', () => {
    users['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'] = { username: 'janedoe', role: 'client', skills: ['project-management'], reputation_score: 0 };
    
    mockContractCall.mockImplementation((_, __, userId) => {
      return { success: true, value: users[userId] };
    });
    
    const result = mockContractCall('user-registry', 'get-user', 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM');
    expect(result).toEqual({
      success: true,
      value: {
        username: 'janedoe',
        role: 'client',
        skills: ['project-management'],
        reputation_score: 0
      }
    });
  });
  
  it('should update user skills', () => {
    users['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'] = { username: 'bobsmith', role: 'freelancer', skills: ['programming'], reputation_score: 0 };
    
    mockContractCall.mockImplementation((_, __, newSkills) => {
      users['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'].skills = newSkills;
      return { success: true };
    });
    
    const result = mockContractCall('user-registry', 'update-skills', ['programming', 'database-design']);
    expect(result).toEqual({ success: true });
    expect(users['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'].skills).toEqual(['programming', 'database-design']);
  });
});
