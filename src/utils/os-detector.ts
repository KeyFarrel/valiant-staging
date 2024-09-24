class OSDetector {
  getOS(): string {
      const userAgent = window.navigator.userAgent;

      if (/Windows NT/.test(userAgent)) {
          return "Windows";
      } else if (/Macintosh/.test(userAgent)) {
          return "Mac OS";
      } else if (/Linux/.test(userAgent)) {
          return "Linux";
      } else if (/Android/.test(userAgent)) {
          return "Android";
      } else if (/iPhone|iPad|iPod/.test(userAgent)) {
          return "iOS";
      } else {
          return "Unknown OS";
      }
  }
}
export const osDetector = new OSDetector();
