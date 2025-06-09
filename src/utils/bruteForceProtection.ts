/**
 * Brute Force Protection Utility
 * Provides protection against brute force attacks by implementing rate limiting,
 * account lockout, and progressive delays
 */

// Store for tracking login attempts
interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  locked: boolean;
  lockExpiration: number | null;
}

// Configuration options
interface BruteForceConfig {
  maxAttempts: number;        // Maximum number of attempts before lockout
  lockoutDuration: number;    // Lockout duration in milliseconds
  resetTime: number;          // Time in milliseconds to reset attempt counter
  progressiveDelay: boolean;  // Whether to implement progressive delays
}

class BruteForceProtection {
  private attempts: Map<string, AttemptRecord> = new Map();
  private config: BruteForceConfig;
  private storage: Storage;

  constructor(config?: Partial<BruteForceConfig>) {
    // Default configuration
    this.config = {
      maxAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
      resetTime: 60 * 60 * 1000, // 1 hour
      progressiveDelay: true,
      ...config
    };
    
    // Use secure storage if available
    this.storage = window.sessionStorage;
    
    // Load existing attempts from storage
    this.loadFromStorage();
  }

  /**
   * Record a login attempt
   * @param identifier - User identifier (username, IP, etc.)
   * @returns Object containing status and wait time if applicable
   */
  public recordAttempt(identifier: string): { allowed: boolean; waitTime: number; message: string } {
    const now = Date.now();
    const record = this.getRecord(identifier);
    
    // Check if account is locked
    if (record.locked) {
      if (record.lockExpiration && now >= record.lockExpiration) {
        // Lock expired, reset the record
        this.resetRecord(identifier);
      } else {
        const waitTime = record.lockExpiration ? record.lockExpiration - now : this.config.lockoutDuration;
        return {
          allowed: false,
          waitTime,
          message: `Account temporarily locked. Try again in ${Math.ceil(waitTime / 60000)} minutes.`
        };
      }
    }
    
    // Update attempt record
    record.count++;
    record.lastAttempt = now;
    
    // Check if we should lock the account
    if (record.count >= this.config.maxAttempts) {
      record.locked = true;
      record.lockExpiration = now + this.config.lockoutDuration;
      this.saveRecord(identifier, record);
      
      return {
        allowed: false,
        waitTime: this.config.lockoutDuration,
        message: `Too many failed attempts. Account locked for ${this.config.lockoutDuration / 60000} minutes.`
      };
    }
    
    // Calculate progressive delay if enabled
    let waitTime = 0;
    if (this.config.progressiveDelay && record.count > 1) {
      // Exponential backoff: 2^(attempts-1) seconds
      waitTime = Math.min(Math.pow(2, record.count - 1) * 1000, 30000); // Max 30 seconds
    }
    
    this.saveRecord(identifier, record);
    
    return {
      allowed: true,
      waitTime,
      message: waitTime > 0 ? `Please wait ${waitTime / 1000} seconds before trying again.` : ''
    };
  }

  /**
   * Reset attempts after successful authentication
   * @param identifier - User identifier
   */
  public resetAttempts(identifier: string): void {
    this.resetRecord(identifier);
  }

  /**
   * Check if an identifier is currently locked out
   * @param identifier - User identifier
   * @returns Whether the identifier is locked out
   */
  public isLocked(identifier: string): boolean {
    const record = this.getRecord(identifier);
    const now = Date.now();
    
    if (record.locked && record.lockExpiration && now >= record.lockExpiration) {
      // Lock expired, reset the record
      this.resetRecord(identifier);
      return false;
    }
    
    return record.locked;
  }

  /**
   * Get remaining attempts before lockout
   * @param identifier - User identifier
   * @returns Number of attempts remaining
   */
  public getRemainingAttempts(identifier: string): number {
    const record = this.getRecord(identifier);
    return Math.max(0, this.config.maxAttempts - record.count);
  }

  /**
   * Get a record for an identifier, creating it if it doesn't exist
   * @param identifier - User identifier
   * @returns Attempt record
   */
  private getRecord(identifier: string): AttemptRecord {
    // Check if we need to clean up old records first
    this.cleanupOldRecords();
    
    // Get or create record
    if (!this.attempts.has(identifier)) {
      const now = Date.now();
      const newRecord: AttemptRecord = {
        count: 0,
        firstAttempt: now,
        lastAttempt: now,
        locked: false,
        lockExpiration: null
      };
      this.attempts.set(identifier, newRecord);
    }
    
    return this.attempts.get(identifier)!;
  }

  /**
   * Save a record to memory and storage
   * @param identifier - User identifier
   * @param record - Attempt record
   */
  private saveRecord(identifier: string, record: AttemptRecord): void {
    this.attempts.set(identifier, record);
    this.saveToStorage();
  }

  /**
   * Reset a record
   * @param identifier - User identifier
   */
  private resetRecord(identifier: string): void {
    const now = Date.now();
    const newRecord: AttemptRecord = {
      count: 0,
      firstAttempt: now,
      lastAttempt: now,
      locked: false,
      lockExpiration: null
    };
    this.saveRecord(identifier, newRecord);
  }

  /**
   * Clean up old records
   */
  private cleanupOldRecords(): void {
    const now = Date.now();
    const resetTime = this.config.resetTime;
    
    for (const [identifier, record] of this.attempts.entries()) {
      // Remove records that are old and not locked
      if (!record.locked && now - record.lastAttempt > resetTime) {
        this.attempts.delete(identifier);
      }
    }
    
    this.saveToStorage();
  }

  /**
   * Save attempts to storage
   */
  private saveToStorage(): void {
    try {
      const data = JSON.stringify(Array.from(this.attempts.entries()));
      this.storage.setItem('bruteForceProtection', data);
    } catch (error) {
      console.error('Failed to save brute force protection data to storage:', error);
    }
  }

  /**
   * Load attempts from storage
   */
  private loadFromStorage(): void {
    try {
      const data = this.storage.getItem('bruteForceProtection');
      if (data) {
        const parsed = JSON.parse(data) as [string, AttemptRecord][];
        this.attempts = new Map(parsed);
      }
    } catch (error) {
      console.error('Failed to load brute force protection data from storage:', error);
    }
  }
}

// Export singleton instance
export const bruteForceProtection = new BruteForceProtection();

// Export the class for custom configurations
export { BruteForceProtection };
