import { osDetector } from "@/utils/os-detector";

describe('OSDetector', () => {
  let originalNavigator: any;

  beforeEach(() => {
    // Simpan navigator yang asli untuk dipulihkan setelah test selesai
    originalNavigator = window.navigator;
  });

  afterEach(() => {
    // Pulihkan navigator yang asli setelah setiap test
    Object.defineProperty(window, 'navigator', { value: originalNavigator, writable: true });
  });

  it('should detect Windows OS', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      writable: true
    });

    const result = osDetector.getOS();
    expect(result).toBe('Windows');
  });

  it('should detect Mac OS', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
      writable: true
    });

    const result = osDetector.getOS();
    expect(result).toBe('Mac OS');
  });

  it('should detect Linux OS', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (X11; Linux x86_64)' },
      writable: true
    });

    const result = osDetector.getOS();
    expect(result).toBe('Linux');
  });

  it('should detect Android OS', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (Linux; Android 10; Pixel 3)' },
      writable: true
    });

    const result = osDetector.getOS();
    expect(result).toBe('Linux');
  });

  it('should detect iOS OS', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X)' },
      writable: true
    });

    const result = osDetector.getOS();
    expect(result).toBe('iOS');
  });

  it('should return Unknown OS for unrecognized OS', () => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (Unknown OS)' },
      writable: true
    });

    const result = osDetector.getOS();
    expect(result).toBe('Unknown OS');
  });
});
