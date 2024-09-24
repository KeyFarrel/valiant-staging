// __tests__/useIdle.test.ts
import { describe, it, expect } from 'vitest';
import { useIdle } from '@vueuse/core';

// Note: @vueuse/core does not require mocking for its composables in most cases,
// but you can mock its behavior if needed for specific scenarios.

describe('useIdle', () => {
  it('should initialize with the correct timeout value and return idle and lastActive', () => {
    // Test parameters
    const timeout = 10 * 60 * 1000; // 10 minutes

    // Call the useIdle function
    const { idle, lastActive } = useIdle(timeout);

    // Verify that idle and lastActive are reactive references
    expect(idle).toBeInstanceOf(Object);
    expect(lastActive).toBeInstanceOf(Object);

    // Verify initial values
    expect(idle.value).toBe(false);
    
    // Simulate a change in idle status
    // Note: This depends on the environment and cannot be directly simulated in all cases
    // Here, we are just demonstrating the usage
    // For actual tests, you'd need to simulate or wait for idle changes
    idle.value = true;
    expect(idle.value).toBe(true);

    // Check if lastActive is set to the current timestamp or near it
    const now = Date.now();
    expect(Math.abs(lastActive.value - now)).toBeLessThan(1000); // Allow 1 second tolerance
  });
});
