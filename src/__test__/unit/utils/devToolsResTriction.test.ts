import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initDevToolsRestriction } from '@/utils/devToolsRestriction';

// Mock secure environment utilities
vi.mock('@/utils/secureEnv', () => ({
  isProduction: vi.fn(),
  isStaging: vi.fn(),
}));

describe('devToolsRestriction', () => {
  let consoleSpy: any;
  
  beforeEach(() => {
    // Mock console.log to track calls
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log development message when not in production or staging', async () => {
    // Import the mocked functions
    const { isProduction, isStaging } = await import('@/utils/secureEnv');
    
    // Set environment to development
    vi.mocked(isProduction).mockReturnValue(false);
    vi.mocked(isStaging).mockReturnValue(false);

    initDevToolsRestriction();

    expect(consoleSpy).toHaveBeenCalledWith('Developer tools enabled');
  });

  it('should log restricted message when in production environment', async () => {
    // Import the mocked functions
    const { isProduction, isStaging } = await import('@/utils/secureEnv');
    
    // Set environment to production
    vi.mocked(isProduction).mockReturnValue(true);
    vi.mocked(isStaging).mockReturnValue(false);

    initDevToolsRestriction();

    expect(consoleSpy).toHaveBeenCalledWith('Developer tools restricted in this environment');
  });

  it('should log restricted message when in staging environment', async () => {
    // Import the mocked functions
    const { isProduction, isStaging } = await import('@/utils/secureEnv');
    
    // Set environment to staging
    vi.mocked(isProduction).mockReturnValue(false);
    vi.mocked(isStaging).mockReturnValue(true);

    initDevToolsRestriction();

    expect(consoleSpy).toHaveBeenCalledWith('Developer tools restricted in this environment');
  });

  it('should handle both production and staging environments', async () => {
    // Import the mocked functions
    const { isProduction, isStaging } = await import('@/utils/secureEnv');
    
    // Set both environments to true
    vi.mocked(isProduction).mockReturnValue(true);
    vi.mocked(isStaging).mockReturnValue(true);

    initDevToolsRestriction();

    expect(consoleSpy).toHaveBeenCalledWith('Developer tools restricted in this environment');
  });

  it('should only call console.log once per execution', async () => {
    // Import the mocked functions
    const { isProduction, isStaging } = await import('@/utils/secureEnv');
    
    // Set environment to development
    vi.mocked(isProduction).mockReturnValue(false);
    vi.mocked(isStaging).mockReturnValue(false);

    initDevToolsRestriction();

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Developer tools enabled');
  });

  it('should call isProduction and isStaging functions', async () => {
    // Import the mocked functions
    const { isProduction, isStaging } = await import('@/utils/secureEnv');
    
    // Set environment to development
    vi.mocked(isProduction).mockReturnValue(false);
    vi.mocked(isStaging).mockReturnValue(false);

    initDevToolsRestriction();

    expect(isProduction).toHaveBeenCalled();
    expect(isStaging).toHaveBeenCalled();
  });

  it('should evaluate both environment checks due to OR operator', async () => {
    // Import the mocked functions
    const { isProduction, isStaging } = await import('@/utils/secureEnv');
    
    // Mock isProduction to return false so isStaging gets evaluated
    vi.mocked(isProduction).mockReturnValue(false);
    vi.mocked(isStaging).mockReturnValue(true);

    initDevToolsRestriction();

    expect(consoleSpy).toHaveBeenCalledWith('Developer tools restricted in this environment');
    // Both functions should be called due to OR evaluation
    expect(isProduction).toHaveBeenCalled();
    expect(isStaging).toHaveBeenCalled();
  });

  it('should call disableDevTools when in production environment', async () => {
    // Import the mocked functions
    const { isProduction, isStaging } = await import('@/utils/secureEnv');
    
    // Set environment to production
    vi.mocked(isProduction).mockReturnValue(true);
    vi.mocked(isStaging).mockReturnValue(false);

    // Mock DOM methods
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});
    
    // Mock setInterval to prevent actual intervals
    const originalSetInterval = global.setInterval;
    global.setInterval = vi.fn(() => 1 as any);

    initDevToolsRestriction();

    // Verify that event listener was added (part of disableDevTools)
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    // Verify console.clear was called (part of disableConsole)
    expect(clearSpy).toHaveBeenCalled();

    // Cleanup
    addEventListenerSpy.mockRestore();
    clearSpy.mockRestore();
    global.setInterval = originalSetInterval;
  });

  it('should prevent F12 keydown event when disableDevTools is active', async () => {
    const { isProduction, isStaging } = await import('@/utils/secureEnv');
    
    // Set environment to production to trigger disableDevTools
    vi.mocked(isProduction).mockReturnValue(true);
    vi.mocked(isStaging).mockReturnValue(false);

    const mockPreventDefault = vi.fn();
    const mockEvent = {
      key: 'F12',
      preventDefault: mockPreventDefault,
      ctrlKey: false,
      shiftKey: false,
      metaKey: false,
      altKey: false
    };

    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});
    const originalSetInterval = global.setInterval;
    global.setInterval = vi.fn(() => 1 as any);

    initDevToolsRestriction();

    // Get the keydown event listener that was added
    const keydownCall = addEventListenerSpy.mock.calls.find((call: any) => call[0] === 'keydown');
    const keydownListener = keydownCall?.[1];
    
    if (keydownListener) {
      const result = (keydownListener as any)(mockEvent);
      expect(mockPreventDefault).toHaveBeenCalled();
      expect(result).toBe(false);
    }

    // Cleanup
    addEventListenerSpy.mockRestore();
    clearSpy.mockRestore();
    global.setInterval = originalSetInterval;
  });

  it('should prevent various keyboard shortcuts when disableDevTools is active', async () => {
    const { isProduction, isStaging } = await import('@/utils/secureEnv');
    
    vi.mocked(isProduction).mockReturnValue(true);
    vi.mocked(isStaging).mockReturnValue(false);

    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});
    const originalSetInterval = global.setInterval;
    global.setInterval = vi.fn(() => 1 as any);

    initDevToolsRestriction();

    const keydownCall = addEventListenerSpy.mock.calls.find((call: any) => call[0] === 'keydown');
    const keydownListener = keydownCall?.[1];

    if (keydownListener) {
      // Test Ctrl+Shift+I
      const mockPreventDefault1 = vi.fn();
      const ctrlShiftI = {
        key: 'I',
        preventDefault: mockPreventDefault1,
        ctrlKey: true,
        shiftKey: true,
        metaKey: false,
        altKey: false
      };
      (keydownListener as any)(ctrlShiftI);
      expect(mockPreventDefault1).toHaveBeenCalled();

      // Test Ctrl+Shift+J
      const mockPreventDefault2 = vi.fn();
      const ctrlShiftJ = {
        key: 'J',
        preventDefault: mockPreventDefault2,
        ctrlKey: true,
        shiftKey: true,
        metaKey: false,
        altKey: false
      };
      (keydownListener as any)(ctrlShiftJ);
      expect(mockPreventDefault2).toHaveBeenCalled();

      // Test Ctrl+U
      const mockPreventDefault3 = vi.fn();
      const ctrlU = {
        key: 'u',
        preventDefault: mockPreventDefault3,
        ctrlKey: true,
        shiftKey: false,
        metaKey: false,
        altKey: false
      };
      (keydownListener as any)(ctrlU);
      expect(mockPreventDefault3).toHaveBeenCalled();
    }

    // Cleanup
    addEventListenerSpy.mockRestore();
    clearSpy.mockRestore();
    global.setInterval = originalSetInterval;
  });

  it('should override console methods when disableDevTools is active', async () => {
    const { isProduction, isStaging } = await import('@/utils/secureEnv');
    
    vi.mocked(isProduction).mockReturnValue(true);
    vi.mocked(isStaging).mockReturnValue(false);

    const originalSetInterval = global.setInterval;
    global.setInterval = vi.fn(() => 1 as any);

    // Store original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});

    initDevToolsRestriction();

    // Verify that console methods have been overridden
    expect(console.log).not.toBe(originalLog);
    expect(console.error).not.toBe(originalError);

    // Cleanup
    clearSpy.mockRestore();
    global.setInterval = originalSetInterval;
  });

  it('should prevent Ctrl+Shift+C and Mac Option+Cmd+C shortcuts', async () => {
    const { isProduction, isStaging } = await import('@/utils/secureEnv');
    
    vi.mocked(isProduction).mockReturnValue(true);
    vi.mocked(isStaging).mockReturnValue(false);

    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const clearSpy = vi.spyOn(console, 'clear').mockImplementation(() => {});
    const originalSetInterval = global.setInterval;
    global.setInterval = vi.fn(() => 1 as any);

    initDevToolsRestriction();

    const keydownCall = addEventListenerSpy.mock.calls.find((call: any) => call[0] === 'keydown');
    const keydownListener = keydownCall?.[1];

    if (keydownListener) {
      // Test Ctrl+Shift+C
      const mockPreventDefault1 = vi.fn();
      const ctrlShiftC = {
        key: 'C',
        preventDefault: mockPreventDefault1,
        ctrlKey: true,
        shiftKey: true,
        metaKey: false,
        altKey: false
      };
      const result1 = (keydownListener as any)(ctrlShiftC);
      expect(mockPreventDefault1).toHaveBeenCalled();
      expect(result1).toBe(false);

      // Test Mac Cmd+Option+C (lowercase c)
      const mockPreventDefault2 = vi.fn();
      const macOptC = {
        key: 'c',
        preventDefault: mockPreventDefault2,
        ctrlKey: false,
        shiftKey: false,
        metaKey: true,
        altKey: true
      };
      const result2 = (keydownListener as any)(macOptC);
      expect(mockPreventDefault2).toHaveBeenCalled();
      expect(result2).toBe(false);
    }

    // Cleanup
    addEventListenerSpy.mockRestore();
    clearSpy.mockRestore();
    global.setInterval = originalSetInterval;
  });
});