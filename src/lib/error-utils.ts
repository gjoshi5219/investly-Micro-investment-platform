/**
 * Error sanitization utility for security
 * Maps database error codes to user-friendly messages
 * Prevents internal details from leaking to users
 */

const ERROR_MESSAGES: Record<string, string> = {
  // PostgreSQL error codes
  '23505': 'This record already exists.',
  '23503': 'The referenced record does not exist.',
  '23514': 'The provided value is not valid.',
  '23502': 'A required field is missing.',
  '22001': 'The provided text is too long.',
  '22003': 'The provided number is out of range.',
  
  // Supabase/PostgREST error codes
  'PGRST116': 'Unable to complete the request.',
  'PGRST301': 'Unable to complete the request.',
  '42501': 'You do not have permission to perform this action.',
  '42P01': 'Unable to complete the request.',
  
  // Auth error codes
  'invalid_grant': 'Invalid email or password.',
  'user_already_exists': 'An account with this email already exists.',
  'email_not_confirmed': 'Please confirm your email address.',
  'invalid_credentials': 'Invalid email or password.',
};

/**
 * Sanitize error messages to prevent information leakage
 * @param error - The error object from Supabase or other sources
 * @param fallbackMessage - A fallback message if the error code is not recognized
 * @returns A user-friendly error message
 */
export function sanitizeError(error: unknown, fallbackMessage = 'An error occurred. Please try again.'): string {
  if (!error) {
    return fallbackMessage;
  }

  // Handle different error object shapes
  const errorObj = error as Record<string, unknown>;
  const code = errorObj.code as string | undefined;
  const status = errorObj.status as string | undefined;
  const message = errorObj.message as string | undefined;

  // Check for known error codes
  if (code && ERROR_MESSAGES[code]) {
    return ERROR_MESSAGES[code];
  }

  if (status && ERROR_MESSAGES[status]) {
    return ERROR_MESSAGES[status];
  }

  // Handle specific auth error messages that are safe to show
  if (message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('already registered') || lowerMessage.includes('already exists')) {
      return 'An account with this email already exists.';
    }
    
    if (lowerMessage.includes('invalid login credentials') || lowerMessage.includes('invalid password')) {
      return 'Invalid email or password.';
    }
    
    if (lowerMessage.includes('email not confirmed')) {
      return 'Please confirm your email address.';
    }

    if (lowerMessage.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.';
    }
  }

  return fallbackMessage;
}

/**
 * Development-only console logging
 * Only logs to console in development mode to prevent information disclosure in production
 */
export function devLog(message: string, ...args: unknown[]): void {
  if (import.meta.env.DEV) {
    console.log(`[DEV] ${message}`, ...args);
  }
}

/**
 * Development-only error logging
 * Only logs errors to console in development mode
 */
export function devError(message: string, error?: unknown): void {
  if (import.meta.env.DEV) {
    console.error(`[DEV ERROR] ${message}`, error);
  }
}
