/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

/**
 * Sanitize email address
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';

  // Remove any HTML tags and trim
  const cleaned = email.replace(/<[^>]*>/g, '').trim();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned)) {
    throw new Error('Invalid email format');
  }

  return cleaned.toLowerCase();
};

/**
 * Sanitize name (remove special characters that could be used for XSS)
 */
export const sanitizeName = (name: string): string => {
  if (!name) return '';

  // Remove HTML tags
  let cleaned = name.replace(/<[^>]*>/g, '');

  // Remove potentially dangerous characters but keep international characters
  // Allow letters, numbers, spaces, hyphens, apostrophes, and dots
  cleaned = cleaned.replace(/[^\p{L}\p{N}\s\-'.]/gu, '');

  return cleaned.trim();
};

/**
 * Sanitize phone number
 */
export const sanitizePhone = (phone: string): string => {
  if (!phone) return '';

  // Remove everything except digits, +, -, (, ), and spaces
  const cleaned = phone.replace(/[^\d+\-() ]/g, '').trim();

  return cleaned;
};

/**
 * Sanitize transaction reference
 * Only allow alphanumeric characters, hyphens, and underscores
 */
export const sanitizeReference = (reference: string): string => {
  if (!reference) {
    throw new Error('Transaction reference is required');
  }

  // Remove any characters that aren't alphanumeric, hyphen, or underscore
  const cleaned = reference.replace(/[^a-zA-Z0-9\-_]/g, '');

  if (cleaned.length === 0) {
    throw new Error('Transaction reference must contain at least one valid character');
  }

  return cleaned;
};

/**
 * Sanitize metadata object
 * Recursively sanitize all string values to prevent XSS
 */
export const sanitizeMetadata = (metadata: Record<string, any>): Record<string, any> => {
  if (!metadata || typeof metadata !== 'object') {
    return {};
  }

  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(metadata)) {
    // Sanitize key
    const cleanKey = key.replace(/[^\w\-]/g, '');

    if (typeof value === 'string') {
      // Remove HTML tags and script tags
      sanitized[cleanKey] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[cleanKey] = value;
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[cleanKey] = sanitizeMetadata(value);
    }
    // Skip functions, undefined, null, etc.
  }

  return sanitized;
};

/**
 * Redact sensitive information from error messages
 */
export const redactSensitiveData = (message: string): string => {
  if (!message) return '';

  // Redact potential API keys (strings that look like keys)
  let redacted = message.replace(/[a-zA-Z0-9]{20,}/g, (match) => {
    // If it looks like a key (long alphanumeric string), redact it
    if (match.length > 20) {
      return `***${match.slice(-4)}`;
    }
    return match;
  });

  // Redact email addresses
  redacted = redacted.replace(/[\w.-]+@[\w.-]+\.\w+/g, '***@***.***');

  // Redact phone numbers
  redacted = redacted.replace(/\+?\d{10,}/g, '***');

  return redacted;
};
