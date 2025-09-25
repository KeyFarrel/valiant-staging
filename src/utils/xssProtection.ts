/**
 * XSS Protection Utility
 * Provides comprehensive protection against Cross-Site Scripting attacks
 */

import DOMPurify from 'dompurify';
import { encode } from 'html-entities';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param html - The HTML content to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // Configure DOMPurify with strict settings
  const purifyConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'eval'],
    ALLOW_DATA_ATTR: false,
    USE_PROFILES: { html: true },
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
    WHOLE_DOCUMENT: false,
    SANITIZE_DOM: true,
    KEEP_CONTENT: true,
    SAFE_FOR_TEMPLATES: true,
    SAFE_FOR_JQUERY: true
  };
  
  // Apply DOMPurify with strict configuration
  return DOMPurify.sanitize(html, purifyConfig);
}

/**
 * Encodes text to prevent XSS in contexts where HTML should not be rendered
 * @param text - The text to encode
 * @returns Encoded text safe for insertion into HTML
 */
export function encodeText(text: string): string {
  if (!text) return '';
  return encode(text, { mode: 'extensive', level: 'html5' });
}

/**
 * Sanitizes URL to prevent javascript: protocol exploits
 * @param url - The URL to sanitize
 * @returns Sanitized URL or empty string if dangerous
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  // Check for javascript: protocol and other dangerous patterns
  const dangerous = /^(?:\s*javascript:|data:|vbscript:|file:)/i;
  if (dangerous.test(url)) {
    return '';
  }
  
  return url;
}

/**
 * Sanitizes JSON input before parsing to prevent prototype pollution
 * @param jsonString - The JSON string to sanitize
 * @returns Parsed object or null if invalid
 */
export function safeJsonParse(jsonString: string): any {
  try {
    // First check if the string contains __proto__ or constructor
    if (/["'](__proto__|constructor|prototype)["']:/i.test(jsonString)) {
      console.error('Potentially dangerous JSON detected');
      return null;
    }
    
    const parsed = JSON.parse(jsonString);
    return parsed;
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return null;
  }
}

/**
 * Generates a random nonce for CSP
 * @returns Random nonce string
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Creates a Vue directive for automatically sanitizing HTML content
 */
export const sanitizeDirective = {
  beforeMount(el: HTMLElement, binding: any) {
    if (binding.value) {
      el.innerHTML = sanitizeHtml(binding.value);
    }
  },
  updated(el: HTMLElement, binding: any) {
    if (binding.value) {
      el.innerHTML = sanitizeHtml(binding.value);
    }
  }
};

/**
 * Applies XSS protection to all user inputs
 * @param value - The input value to sanitize
 * @returns Sanitized input value
 */
export function sanitizeInput(value: string): string {
  if (!value) return '';
  return encodeText(value);
}

/**
 * Validates and sanitizes form data
 * @param formData - The form data object to sanitize
 * @returns Sanitized form data
 */
export function sanitizeFormData(formData: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeFormData(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Initializes global XSS protection
 */
export function initXssProtection(): void {
  // Configure DOMPurify globally
  DOMPurify.setConfig({
    ADD_ATTR: ['target', 'rel', 'noopener', 'noreferrer'],
    FORBID_CONTENTS: ['style', 'script', 'iframe', 'form', 'object', 'embed', 'applet'],
    FORCE_BODY: true,
    SANITIZE_DOM: true
  });
  
  // Add hooks to catch DOM manipulation attempts
  DOMPurify.addHook('beforeSanitizeElements', (node) => {
    // Check if node is an Element before accessing tagName
    if (node instanceof Element && (node.tagName === 'SCRIPT' || node.tagName === 'STYLE')) {
      console.warn('Attempted to inject script or style tag blocked');
    }
    return node;
  });
  
  // Override innerHTML and outerHTML setters globally to enforce sanitization
  if (typeof window !== 'undefined') {
    const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    const originalOuterHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'outerHTML');
    
    if (originalInnerHTML?.set) {
      Object.defineProperty(Element.prototype, 'innerHTML', {
        set(value) {
          const sanitizedValue = sanitizeHtml(value);
          originalInnerHTML.set?.call(this, sanitizedValue);
        },
        get: originalInnerHTML.get
      });
    }
    
    if (originalOuterHTML?.set) {
      Object.defineProperty(Element.prototype, 'outerHTML', {
        set(value) {
          const sanitizedValue = sanitizeHtml(value);
          originalOuterHTML.set?.call(this, sanitizedValue);
        },
        get: originalOuterHTML.get
      });
    }
    
    // Patch insertAdjacentHTML to sanitize content
    const originalInsertAdjacentHTML = Element.prototype.insertAdjacentHTML;
    Element.prototype.insertAdjacentHTML = function(position: string, text: string): void {
      const sanitizedText = sanitizeHtml(text);
      originalInsertAdjacentHTML.call(this, position, sanitizedText);
    };
  }
}
