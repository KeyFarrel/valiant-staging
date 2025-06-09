/**
 * Path Traversal Protection Utility
 * Provides protection against path traversal attacks by sanitizing file paths
 * and validating URLs to prevent directory traversal exploits
 */

import { sanitizeUrl } from './xssProtection';
import path from 'path-browserify';

/**
 * Sanitizes a file path to prevent path traversal attacks
 * @param filePath - The file path to sanitize
 * @param allowedBasePath - Optional base path to restrict access to
 * @returns Sanitized file path
 */
export function sanitizeFilePath(filePath: string, allowedBasePath?: string): string {
  if (!filePath) return '';
  
  try {
    // Normalize the path to resolve .. and . segments
    const normalizedPath = path.normalize(filePath)
      // Replace backslashes with forward slashes for consistency
      .replace(/\\/g, '/')
      // Remove multiple consecutive slashes
      .replace(/\/+/g, '/');
    
    // Check for path traversal patterns
    const hasTraversalPatterns = /(^|\/)(\.\.)(\/|$)/.test(normalizedPath);
    if (hasTraversalPatterns) {
      console.warn('Path traversal attempt detected:', filePath);
      return '';
    }
    
    // If a base path is provided, ensure the normalized path is within it
    if (allowedBasePath) {
      const normalizedBasePath = path.normalize(allowedBasePath).replace(/\\/g, '/');
      
      if (!normalizedPath.startsWith(normalizedBasePath)) {
        console.warn('Path access outside allowed base path:', filePath);
        return '';
      }
    }
    
    return normalizedPath;
  } catch (error) {
    console.error('Error sanitizing file path:', error);
    return '';
  }
}

/**
 * Validates a URL to prevent path traversal in URLs
 * @param url - The URL to validate
 * @param allowedDomains - Optional array of allowed domains
 * @returns Sanitized URL or empty string if invalid
 */
export function validateUrl(url: string, allowedDomains?: string[]): string {
  // First use XSS sanitization
  const sanitizedUrl = sanitizeUrl(url);
  if (!sanitizedUrl) return '';
  
  try {
    // Parse the URL
    const parsedUrl = new URL(sanitizedUrl);
    
    // Check for path traversal patterns in pathname
    const pathname = parsedUrl.pathname;
    if (/(^|\/)(\.\.)(\/|$)/.test(pathname)) {
      console.warn('Path traversal attempt detected in URL:', url);
      return '';
    }
    
    // If allowed domains are specified, validate the hostname
    if (allowedDomains && allowedDomains.length > 0) {
      const hostname = parsedUrl.hostname;
      const isAllowedDomain = allowedDomains.some(domain => 
        hostname === domain || hostname.endsWith(`.${domain}`)
      );
      
      if (!isAllowedDomain) {
        console.warn('URL domain not in allowed list:', hostname);
        return '';
      }
    }
    
    return sanitizedUrl;
  } catch (error) {
    // If URL parsing fails, it's not a valid URL
    console.error('Invalid URL:', url);
    return '';
  }
}

/**
 * Validates file extensions to ensure only allowed types are processed
 * @param filename - The filename to validate
 * @param allowedExtensions - Array of allowed file extensions
 * @returns Whether the file extension is allowed
 */
export function validateFileExtension(filename: string, allowedExtensions: string[]): boolean {
  if (!filename) return false;
  
  // Get the file extension
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  // Check if the extension is in the allowed list
  return allowedExtensions.includes(extension);
}

/**
 * Validates and sanitizes a file upload path
 * @param uploadPath - The upload path to validate
 * @param filename - The filename to validate
 * @param allowedExtensions - Array of allowed file extensions
 * @returns Sanitized upload path or null if invalid
 */
export function validateUploadPath(
  uploadPath: string, 
  filename: string, 
  allowedExtensions: string[]
): string | null {
  // Validate file extension
  if (!validateFileExtension(filename, allowedExtensions)) {
    console.warn('Invalid file extension:', filename);
    return null;
  }
  
  // Sanitize the upload path
  const sanitizedPath = sanitizeFilePath(uploadPath);
  if (!sanitizedPath) {
    return null;
  }
  
  // Sanitize the filename to remove any path components
  const sanitizedFilename = path.basename(filename);
  
  // Combine path and filename
  return `${sanitizedPath}/${sanitizedFilename}`;
}

/**
 * Creates a safe relative path from a potentially unsafe input
 * @param unsafePath - The potentially unsafe path
 * @returns A safe relative path
 */
export function createSafeRelativePath(unsafePath: string): string {
  if (!unsafePath) return '';
  
  // Remove any absolute path indicators
  let safePath = unsafePath.replace(/^[\/\\]/, '');
  
  // Remove any parent directory traversal
  safePath = safePath.replace(/\.\.\//g, '').replace(/\.\.\\/g, '');
  
  // Normalize slashes
  safePath = safePath.replace(/\\/g, '/');
  
  return safePath;
}

/**
 * Validates a path parameter from a URL
 * @param param - The path parameter to validate
 * @returns Sanitized parameter or empty string if invalid
 */
export function validatePathParam(param: string): string {
  if (!param) return '';
  
  // Remove any path traversal sequences
  const sanitized = param
    .replace(/\.\.\//g, '')
    .replace(/\.\.\\/g, '')
    .replace(/\\/g, '')
    // Prevent command injection
    .replace(/[&;|$]/g, '');
  
  return sanitized;
}

/**
 * Initializes path traversal protection for fetch and XHR requests
 */
export function initPathTraversalProtection(): void {
  // Override fetch to validate URLs
  const originalFetch = window.fetch;
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    if (typeof input === 'string') {
      const validatedUrl = validateUrl(input);
      if (!validatedUrl) {
        console.error('Blocked fetch request to potentially unsafe URL:', input);
        return Promise.reject(new Error('Unsafe URL detected'));
      }
      input = validatedUrl;
    } else if (input instanceof URL) {
      const validatedUrl = validateUrl(input.toString());
      if (!validatedUrl) {
        console.error('Blocked fetch request to potentially unsafe URL:', input.toString());
        return Promise.reject(new Error('Unsafe URL detected'));
      }
      input = new URL(validatedUrl);
    }
    
    return originalFetch.call(window, input, init);
  };
  
  // Override XMLHttpRequest to validate URLs
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(
    method: string, 
    url: string | URL, 
    async: boolean = true, 
    username?: string | null, 
    password?: string | null
  ): void {
    const urlString = url.toString();
    const validatedUrl = validateUrl(urlString);
    if (!validatedUrl) {
      console.error('Blocked XHR request to potentially unsafe URL:', urlString);
      throw new Error('Unsafe URL detected');
    }
    
    originalOpen.call(this, method, validatedUrl, async, username, password);
  };
}
