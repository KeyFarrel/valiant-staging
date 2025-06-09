/**
 * File Upload Validation Utility
 * Provides comprehensive validation for file uploads including:
 * - MIME type validation
 * - File extension validation
 * - File size limits
 * - Content validation
 */

// Allowed file types configuration
export const ALLOWED_FILE_TYPES = {
  // Images
  IMAGE: {
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    maxSize: 5 * 1024 * 1024, // 5MB
  },
  // Documents
  PDF: {
    extensions: ['pdf'],
    mimeTypes: ['application/pdf'],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  // Excel files
  EXCEL: {
    extensions: ['xls', 'xlsx', 'csv'],
    mimeTypes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel.sheet.macroEnabled.12',
      'text/csv',
      'application/csv'
    ],
    maxSize: 15 * 1024 * 1024, // 15MB
  }
};

// Combined lists for easier validation
export const ALL_ALLOWED_EXTENSIONS = [
  ...ALLOWED_FILE_TYPES.IMAGE.extensions,
  ...ALLOWED_FILE_TYPES.PDF.extensions,
  ...ALLOWED_FILE_TYPES.EXCEL.extensions
];

export const ALL_ALLOWED_MIME_TYPES = [
  ...ALLOWED_FILE_TYPES.IMAGE.mimeTypes,
  ...ALLOWED_FILE_TYPES.PDF.mimeTypes,
  ...ALLOWED_FILE_TYPES.EXCEL.mimeTypes
];

// Maximum allowed file size (largest of all categories)
export const MAX_FILE_SIZE = Math.max(
  ALLOWED_FILE_TYPES.IMAGE.maxSize,
  ALLOWED_FILE_TYPES.PDF.maxSize,
  ALLOWED_FILE_TYPES.EXCEL.maxSize
);

/**
 * Error types for file validation
 */
export enum FileValidationErrorType {
  INVALID_EXTENSION = 'INVALID_EXTENSION',
  INVALID_MIME_TYPE = 'INVALID_MIME_TYPE',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  MIME_TYPE_MISMATCH = 'MIME_TYPE_MISMATCH',
  CONTENT_VALIDATION_FAILED = 'CONTENT_VALIDATION_FAILED',
  EMPTY_FILE = 'EMPTY_FILE'
}

/**
 * Result of file validation
 */
export interface FileValidationResult {
  valid: boolean;
  errorType?: FileValidationErrorType;
  errorMessage?: string;
  fileType?: keyof typeof ALLOWED_FILE_TYPES;
}

/**
 * Validates file extension
 * @param filename - The filename to validate
 * @returns Whether the extension is allowed and the file type
 */
export function validateFileExtension(filename: string): { valid: boolean; fileType?: keyof typeof ALLOWED_FILE_TYPES } {
  if (!filename) return { valid: false };
  
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  if (!extension || !ALL_ALLOWED_EXTENSIONS.includes(extension)) {
    return { valid: false };
  }
  
  // Determine file type based on extension
  let fileType: keyof typeof ALLOWED_FILE_TYPES | undefined;
  
  if (ALLOWED_FILE_TYPES.IMAGE.extensions.includes(extension)) {
    fileType = 'IMAGE';
  } else if (ALLOWED_FILE_TYPES.PDF.extensions.includes(extension)) {
    fileType = 'PDF';
  } else if (ALLOWED_FILE_TYPES.EXCEL.extensions.includes(extension)) {
    fileType = 'EXCEL';
  }
  
  return { valid: true, fileType };
}

/**
 * Validates file MIME type
 * @param mimeType - The MIME type to validate
 * @returns Whether the MIME type is allowed and the file type
 */
export function validateMimeType(mimeType: string): { valid: boolean; fileType?: keyof typeof ALLOWED_FILE_TYPES } {
  if (!mimeType) return { valid: false };
  
  if (!ALL_ALLOWED_MIME_TYPES.includes(mimeType)) {
    return { valid: false };
  }
  
  // Determine file type based on MIME type
  let fileType: keyof typeof ALLOWED_FILE_TYPES | undefined;
  
  if (ALLOWED_FILE_TYPES.IMAGE.mimeTypes.includes(mimeType)) {
    fileType = 'IMAGE';
  } else if (ALLOWED_FILE_TYPES.PDF.mimeTypes.includes(mimeType)) {
    fileType = 'PDF';
  } else if (ALLOWED_FILE_TYPES.EXCEL.mimeTypes.includes(mimeType)) {
    fileType = 'EXCEL';
  }
  
  return { valid: true, fileType };
}

/**
 * Checks if the file extension matches its MIME type
 * @param filename - The filename to check
 * @param mimeType - The MIME type to check
 * @returns Whether the extension and MIME type match
 */
export function validateExtensionMimeTypeMatch(filename: string, mimeType: string): boolean {
  const extensionResult = validateFileExtension(filename);
  const mimeTypeResult = validateMimeType(mimeType);
  
  if (!extensionResult.valid || !mimeTypeResult.valid) {
    return false;
  }
  
  // Check if the determined file types match
  return extensionResult.fileType === mimeTypeResult.fileType;
}

/**
 * Validates file size
 * @param fileSize - The file size in bytes
 * @param fileType - The type of file being validated
 * @returns Whether the file size is within limits
 */
export function validateFileSize(fileSize: number, fileType?: keyof typeof ALLOWED_FILE_TYPES): boolean {
  if (fileSize <= 0) {
    return false; // Empty file
  }
  
  if (fileType) {
    // Check against specific file type limit
    return fileSize <= ALLOWED_FILE_TYPES[fileType].maxSize;
  } else {
    // Check against global maximum
    return fileSize <= MAX_FILE_SIZE;
  }
}

/**
 * Performs basic content validation by checking file signatures (magic numbers)
 * @param file - The file to validate
 * @returns Promise resolving to whether the content appears valid
 */
export async function validateFileContent(file: File): Promise<boolean> {
  // Skip for small files
  if (file.size < 4) {
    return false;
  }
  
  try {
    const buffer = await readFileAsArrayBuffer(file, 0, Math.min(50, file.size));
    const arr = new Uint8Array(buffer);
    
    // Check file signatures based on file type
    const mimeType = file.type;
    
    // PDF signature: %PDF (25 50 44 46)
    if (mimeType === 'application/pdf') {
      return arr[0] === 0x25 && arr[1] === 0x50 && arr[2] === 0x44 && arr[3] === 0x46;
    }
    
    // JPEG signature: FF D8 FF
    if (mimeType === 'image/jpeg') {
      return arr[0] === 0xFF && arr[1] === 0xD8 && arr[2] === 0xFF;
    }
    
    // PNG signature: 89 50 4E 47 0D 0A 1A 0A
    if (mimeType === 'image/png') {
      return arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47 &&
             arr[4] === 0x0D && arr[5] === 0x0A && arr[6] === 0x1A && arr[7] === 0x0A;
    }
    
    // GIF signature: GIF87a (47 49 46 38 37 61) or GIF89a (47 49 46 38 39 61)
    if (mimeType === 'image/gif') {
      return arr[0] === 0x47 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x38 &&
             ((arr[4] === 0x37 || arr[4] === 0x39) && arr[5] === 0x61);
    }
    
    // Excel (.xls) signature: D0 CF 11 E0 A1 B1 1A E1 (BIFF format)
    if (mimeType === 'application/vnd.ms-excel') {
      return arr[0] === 0xD0 && arr[1] === 0xCF && arr[2] === 0x11 && arr[3] === 0xE0;
    }
    
    // Excel (.xlsx) and other Office Open XML files: PK (50 4B)
    if (mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return arr[0] === 0x50 && arr[1] === 0x4B;
    }
    
    // For CSV, check if content is text and contains commas or semicolons
    if (mimeType === 'text/csv' || mimeType === 'application/csv') {
      const textContent = await readFileAsText(file, 0, Math.min(1024, file.size));
      return /^[\w\s\-,.;:"']+$/.test(textContent) && (textContent.includes(',') || textContent.includes(';'));
    }
    
    // For other types, just check if the MIME type is allowed
    return ALL_ALLOWED_MIME_TYPES.includes(mimeType);
  } catch (error) {
    console.error('Error validating file content:', error);
    return false;
  }
}

/**
 * Helper function to read a portion of a file as ArrayBuffer
 */
function readFileAsArrayBuffer(file: File, start: number, end: number): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file.slice(start, end));
  });
}

/**
 * Helper function to read a portion of a file as text
 */
function readFileAsText(file: File, start: number, end: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file.slice(start, end));
  });
}

/**
 * Comprehensive file validation
 * @param file - The file to validate
 * @returns Promise resolving to validation result
 */
export async function validateFile(file: File): Promise<FileValidationResult> {
  // Check if file exists and is not empty
  if (!file || file.size === 0) {
    return {
      valid: false,
      errorType: FileValidationErrorType.EMPTY_FILE,
      errorMessage: 'File is empty or invalid'
    };
  }
  
  // Validate file extension
  const extensionValidation = validateFileExtension(file.name);
  if (!extensionValidation.valid) {
    return {
      valid: false,
      errorType: FileValidationErrorType.INVALID_EXTENSION,
      errorMessage: `File extension not allowed. Allowed extensions: ${ALL_ALLOWED_EXTENSIONS.join(', ')}`
    };
  }
  
  // Validate MIME type
  const mimeTypeValidation = validateMimeType(file.type);
  if (!mimeTypeValidation.valid) {
    return {
      valid: false,
      errorType: FileValidationErrorType.INVALID_MIME_TYPE,
      errorMessage: `File type not allowed. Allowed types: PDF, Images, Excel/CSV`
    };
  }
  
  // Check if extension matches MIME type
  if (!validateExtensionMimeTypeMatch(file.name, file.type)) {
    return {
      valid: false,
      errorType: FileValidationErrorType.MIME_TYPE_MISMATCH,
      errorMessage: 'File extension does not match its content type'
    };
  }
  
  // Use the more specific file type if available
  const fileType = extensionValidation.fileType || mimeTypeValidation.fileType;
  
  // Validate file size
  if (!validateFileSize(file.size, fileType)) {
    const maxSize = fileType ? 
      ALLOWED_FILE_TYPES[fileType].maxSize / (1024 * 1024) : 
      MAX_FILE_SIZE / (1024 * 1024);
    
    return {
      valid: false,
      errorType: FileValidationErrorType.FILE_TOO_LARGE,
      errorMessage: `File size exceeds the maximum allowed size of ${maxSize}MB`
    };
  }
  
  // Validate file content (signatures/magic numbers)
  const contentValid = await validateFileContent(file);
  if (!contentValid) {
    return {
      valid: false,
      errorType: FileValidationErrorType.CONTENT_VALIDATION_FAILED,
      errorMessage: 'File content validation failed. The file may be corrupted or not match its declared type'
    };
  }
  
  // All validations passed
  return {
    valid: true,
    fileType
  };
}

/**
 * Vue directive for file input validation
 */
export const fileValidationDirective = {
  mounted(el: HTMLInputElement, binding: any) {
    if (el.tagName !== 'INPUT' || el.type !== 'file') return;
    
    const validateOnChange = async (event: Event) => {
      const input = event.target as HTMLInputElement;
      const files = input.files;
      
      if (!files || files.length === 0) return;
      
      // Get validation options from binding
      const options = binding.value || {};
      
      // Validate each file
      const invalidFiles = [];
      for (let i = 0; i < files.length; i++) {
        const result = await validateFile(files[i]);
        if (!result.valid) {
          invalidFiles.push({ file: files[i], error: result.errorMessage });
        }
      }
      
      // Handle invalid files
      if (invalidFiles.length > 0) {
        // Clear the input
        input.value = '';
        
        // Display error message
        if (options.onError) {
          options.onError(invalidFiles);
        } else {
          alert(`Invalid file(s): ${invalidFiles.map(f => f.error).join('\n')}`);
        }
        
        // Prevent form submission
        event.preventDefault();
        event.stopPropagation();
      }
    };
    
    // Add event listener
    el.addEventListener('change', validateOnChange);
  }
};

/**
 * Register the file validation directive with Vue
 * @param app - Vue application instance
 */
export function registerFileValidation(app: any) {
  app.directive('file-validate', fileValidationDirective);
}
