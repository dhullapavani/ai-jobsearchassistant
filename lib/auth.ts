export interface UserSession {
  id: string;
  userId: string;
  email: string;
  role: 'User' | 'Admin';
  isActive: boolean;
}

export class AuthService {
  /**
   * Stub for session validation.
   * In a real app, this would use NextAuth.js or JWT verification.
   */
  static async getSession(req?: Request): Promise<UserSession | null> {
    // Return a mock session to prevent breaking the existing app
    return {
      id: 'session-demo-001',
      userId: 'user-demo-001',
      email: 'demo@jobpilot.ai',
      role: 'User',
      isActive: true
    };
  }

  /**
   * Defines data boundaries. Ensures user A cannot fetch user B's data.
   */
  static authorizeDataAccess(session: UserSession | null, resourceOwnerId: string): boolean {
    if (!session || !session.isActive) return false;
    if (session.role === 'Admin') return true;
    return session.userId === resourceOwnerId;
  }
}
