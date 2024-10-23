import { useThemeManager } from "@/plugins/themeManager";
import { defaults, currentTheme, isDark, pluginInitiated } from '@/plugins/themeManager/reactives';

describe('Theme Manager', () => {
  let themeManager: any;

    // Reset nilai defaults dan reactive variables
    beforeEach(() => {
      // Mock window.matchMedia untuk setiap tes
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false, // Atur apakah defaultnya tema gelap atau terang
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        })),
      });
      
      // Buat instance theme manager
      themeManager = useThemeManager();
    });

  it('should initialize plugin if not already initiated', () => {
    expect(pluginInitiated.value).toBe(true); // Pastikan plugin telah diinisiasi
    expect(currentTheme.value).toBe('light'); // Current theme harus light karena isDark = false
  });

  it('should set theme correctly using setTheme()', () => {
    themeManager.set('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark'); // Pastikan theme diubah ke dark
    expect(currentTheme.value).toBe('dark'); // Pastikan currentTheme diubah
  });

  it('should toggle between light and dark mode using toggleDark()', () => {
    themeManager.toggleDark();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light'); // Awalnya light, toggle ke dark
    expect(currentTheme.value).toBe('light');

    themeManager.toggleDark();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark'); // Sekarang toggle kembali ke light
    expect(currentTheme.value).toBe('dark');
  });

  it('should get the current theme using getTheme()', () => {
    themeManager.set('dark');
    expect(themeManager.get()).toBe('dark'); // Pastikan current theme didapatkan dengan benar
  });

  it('should set default themes using setDefaults()', () => {
    themeManager.setDefaults({ light: 'cupcake', dark: 'halloween' });
    expect(defaults.light).toBe('cupcake'); // Pastikan default light diubah
    expect(defaults.dark).toBe('halloween'); // Pastikan default dark diubah

    themeManager.set('default');
    expect(currentTheme.value).toBe('cupcake'); // Karena isDark = false, harusnya jadi light (cupcake)
  });

  it('should return default light and dark themes using getDefaults()', () => {
    themeManager.setDefaults({ light: 'luxury', dark: 'dracula' });
    const defaultThemes = themeManager.getDefaults();
    expect(defaultThemes.light).toBe('luxury'); // Light theme yang baru
    expect(defaultThemes.dark).toBe('dracula'); // Dark theme yang baru
  });

  it('should watch for system theme changes using isWatchingSystemTheme()', () => {
    themeManager.watchSystemTheme(true);
    expect(defaults.watchSystemTheme).toBe(true); // Pastikan watchSystemTheme = true

    themeManager.watchSystemTheme(false);
    expect(defaults.watchSystemTheme).toBe(false); // Pastikan watchSystemTheme = false
  });

  it('should handle system theme change event', () => {
    // Simulasikan event perubahan tema sistem
    const matchMediaSpy = jest.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: (event: string, callback: (event: any) => void) => {
        callback({ matches: true }); // Simulasikan perubahan ke dark mode
      },
      removeEventListener: jest.fn(),
    } as any);

    const themeManager = useThemeManager();
    expect(isDark.value).toBe(true); // Seharusnya beralih ke mode gelap
    expect(currentTheme.value).toBe('luxury'); // Tema seharusnya dark

    matchMediaSpy.mockRestore();
  });
});
