import { initDevToolsRestriction } from "@/utils/devToolsRestriction";
import * as secureEnv from "@/utils/secureEnv";

// Mock secureEnv module
jest.mock("@/utils/secureEnv", () => ({
  isProduction: jest.fn(),
  isStaging: jest.fn(),
}));

describe("devToolsRestriction.ts", () => {
  let mockIsProduction: jest.MockedFunction<typeof secureEnv.isProduction>;
  let mockIsStaging: jest.MockedFunction<typeof secureEnv.isStaging>;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks
    mockIsProduction = secureEnv.isProduction as jest.MockedFunction<typeof secureEnv.isProduction>;
    mockIsStaging = secureEnv.isStaging as jest.MockedFunction<typeof secureEnv.isStaging>;
    
    // Mock console methods
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Environment Detection", () => {
    it("should restrict dev tools in production environment", () => {
      mockIsProduction.mockReturnValue(true);
      mockIsStaging.mockReturnValue(false);

      initDevToolsRestriction();

      expect(consoleLogSpy).toHaveBeenCalledWith('Developer tools restricted in this environment');
      expect(mockIsProduction).toHaveBeenCalled();
      // isStaging might not be called due to short-circuit evaluation in OR condition
    });

    it("should restrict dev tools in staging environment", () => {
      mockIsProduction.mockReturnValue(false);
      mockIsStaging.mockReturnValue(true);

      initDevToolsRestriction();

      expect(consoleLogSpy).toHaveBeenCalledWith('Developer tools restricted in this environment');
      expect(mockIsProduction).toHaveBeenCalled();
      expect(mockIsStaging).toHaveBeenCalled();
    });

    it("should enable dev tools in development environment", () => {
      mockIsProduction.mockReturnValue(false);
      mockIsStaging.mockReturnValue(false);

      initDevToolsRestriction();

      expect(consoleLogSpy).toHaveBeenCalledWith('Developer tools enabled');
      expect(mockIsProduction).toHaveBeenCalled();
      expect(mockIsStaging).toHaveBeenCalled();
    });

    it("should restrict dev tools when both production and staging are true", () => {
      mockIsProduction.mockReturnValue(true);
      mockIsStaging.mockReturnValue(true);

      initDevToolsRestriction();

      expect(consoleLogSpy).toHaveBeenCalledWith('Developer tools restricted in this environment');
    });
  });

  describe("Basic Function Behavior", () => {
    it("should be a function", () => {
      expect(typeof initDevToolsRestriction).toBe('function');
    });

    it("should not throw errors when called", () => {
      mockIsProduction.mockReturnValue(false);
      mockIsStaging.mockReturnValue(false);

      expect(() => {
        initDevToolsRestriction();
      }).not.toThrow();
    });

    it("should handle undefined environment values gracefully", () => {
      mockIsProduction.mockReturnValue(undefined as any);
      mockIsStaging.mockReturnValue(undefined as any);

      expect(() => {
        initDevToolsRestriction();
      }).not.toThrow();
    });
  });

  describe("Console Integration", () => {
    it("should call console.log with appropriate message", () => {
      mockIsProduction.mockReturnValue(true);
      mockIsStaging.mockReturnValue(false);

      initDevToolsRestriction();

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith('Developer tools restricted in this environment');
    });

    it("should not expose sensitive environment information", () => {
      mockIsProduction.mockReturnValue(true);
      mockIsStaging.mockReturnValue(false);

      initDevToolsRestriction();

      // Ensure no sensitive information is logged
      expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining('production'));
      expect(consoleLogSpy).not.toHaveBeenCalledWith(expect.stringContaining('staging'));
      expect(consoleLogSpy).toHaveBeenCalledWith('Developer tools restricted in this environment');
    });
  });

  describe("Error Handling", () => {
    it("should handle secureEnv module import errors gracefully", () => {
      // Mock secureEnv functions to throw errors
      mockIsProduction.mockImplementation(() => {
        throw new Error("secureEnv error");
      });

      expect(() => {
        initDevToolsRestriction();
      }).toThrow("secureEnv error");
    });

    it("should handle console.log errors gracefully", () => {
      consoleLogSpy.mockImplementation(() => {
        throw new Error("Console error");
      });

      mockIsProduction.mockReturnValue(false);
      mockIsStaging.mockReturnValue(false);

      expect(() => {
        initDevToolsRestriction();
      }).toThrow("Console error");
    });
  });

  describe("Logic Flow", () => {
    it("should follow correct logic flow for production", () => {
      mockIsProduction.mockReturnValue(true);
      mockIsStaging.mockReturnValue(false);

      initDevToolsRestriction();

      // Verify the functions were called
      expect(mockIsProduction).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('Developer tools restricted in this environment');
      // isStaging might not be called due to short-circuit evaluation
    });

    it("should follow correct logic flow for development", () => {
      mockIsProduction.mockReturnValue(false);
      mockIsStaging.mockReturnValue(false);

      initDevToolsRestriction();

      // Verify the functions were called
      expect(mockIsProduction).toHaveBeenCalled();
      expect(mockIsStaging).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith('Developer tools enabled');
    });
  });

  describe("Function Return Value", () => {
    it("should return void", () => {
      mockIsProduction.mockReturnValue(false);
      mockIsStaging.mockReturnValue(false);

      const result = initDevToolsRestriction();

      expect(result).toBeUndefined();
    });
  });

  describe("Multiple Calls", () => {
    it("should handle multiple calls correctly", () => {
      mockIsProduction.mockReturnValue(true);
      mockIsStaging.mockReturnValue(false);

      initDevToolsRestriction();
      initDevToolsRestriction();
      initDevToolsRestriction();

      expect(consoleLogSpy).toHaveBeenCalledTimes(3);
      expect(mockIsProduction).toHaveBeenCalledTimes(3);
      // isStaging might not be called due to short-circuit evaluation in OR condition
    });

    it("should maintain consistent behavior across multiple calls", () => {
      mockIsProduction.mockReturnValue(false);
      mockIsStaging.mockReturnValue(false);

      const results = [
        initDevToolsRestriction(),
        initDevToolsRestriction(),
        initDevToolsRestriction()
      ];

      // All calls should return undefined
      results.forEach(result => {
        expect(result).toBeUndefined();
      });

      // All calls should log the same message
      expect(consoleLogSpy).toHaveBeenCalledTimes(3);
      consoleLogSpy.mock.calls.forEach(call => {
        expect(call[0]).toBe('Developer tools enabled');
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle boolean edge cases", () => {
      // Test with truthy/falsy values
      mockIsProduction.mockReturnValue(1 as any);
      mockIsStaging.mockReturnValue(0 as any);

      initDevToolsRestriction();

      expect(consoleLogSpy).toHaveBeenCalledWith('Developer tools restricted in this environment');
    });

    it("should handle null values", () => {
      mockIsProduction.mockReturnValue(null as any);
      mockIsStaging.mockReturnValue(null as any);

      initDevToolsRestriction();

      expect(consoleLogSpy).toHaveBeenCalledWith('Developer tools enabled');
    });
  });

  describe("Performance", () => {
    it("should execute quickly", () => {
      mockIsProduction.mockReturnValue(true);
      mockIsStaging.mockReturnValue(false);

      const startTime = performance.now();
      initDevToolsRestriction();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should execute in less than 100ms
    });
  });

  describe("Message Content Validation", () => {
    it("should use exact message for restricted environment", () => {
      mockIsProduction.mockReturnValue(true);
      mockIsStaging.mockReturnValue(false);

      initDevToolsRestriction();

      expect(consoleLogSpy).toHaveBeenCalledWith('Developer tools restricted in this environment');
      expect(consoleLogSpy).not.toHaveBeenCalledWith('Developer tools enabled');
    });

    it("should use exact message for development environment", () => {
      mockIsProduction.mockReturnValue(false);
      mockIsStaging.mockReturnValue(false);

      initDevToolsRestriction();

      expect(consoleLogSpy).toHaveBeenCalledWith('Developer tools enabled');
      expect(consoleLogSpy).not.toHaveBeenCalledWith('Developer tools restricted in this environment');
    });

    it("should not log any other messages", () => {
      mockIsProduction.mockReturnValue(true);
      mockIsStaging.mockReturnValue(false);

      initDevToolsRestriction();

      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).toHaveBeenCalledWith('Developer tools restricted in this environment');
    });
  });

  describe("Component Name Validation", () => {
    it("should export initDevToolsRestriction function", () => {
      expect(initDevToolsRestriction).toBeDefined();
      expect(typeof initDevToolsRestriction).toBe('function');
      expect(initDevToolsRestriction.name).toBe('initDevToolsRestriction');
    });
  });
});
