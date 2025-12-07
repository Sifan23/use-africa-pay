const LOADED_SCRIPTS: Record<string, Promise<void>> = {};
const SCRIPT_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

interface ScriptLoadOptions {
  nonce?: string; // CSP nonce
  timeout?: number;
  retries?: number;
}

/**
 * Wait for a specified duration
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Load external script with timeout, retry logic, and CSP support
 */
export const loadScript = (
  src: string,
  options: ScriptLoadOptions = {}
): Promise<void> => {
  // Validate URL to prevent injection
  if (!src || typeof src !== 'string') {
    return Promise.reject(new Error('Invalid script URL'));
  }

  // Ensure HTTPS (except localhost for development)
  if (!src.startsWith('https://') && !src.includes('localhost')) {
    return Promise.reject(new Error('Script must be loaded over HTTPS'));
  }

  // Return existing promise if script is already loading/loaded
  if (LOADED_SCRIPTS[src] !== undefined) {
    return LOADED_SCRIPTS[src];
  }

  const timeout = options.timeout || SCRIPT_TIMEOUT;
  const maxRetries = options.retries !== undefined ? options.retries : MAX_RETRIES;

  const loadWithRetry = async (attempt: number = 0): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if script already exists in DOM
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;

      // Add CSP nonce if provided
      if (options.nonce) {
        script.nonce = options.nonce;
      }

      // Set up timeout
      const timeoutId = setTimeout(() => {
        script.remove();
        reject(new Error(`Script loading timeout: ${src}`));
      }, timeout);

      script.onload = () => {
        clearTimeout(timeoutId);
        resolve();
      };

      script.onerror = async () => {
        clearTimeout(timeoutId);
        script.remove();

        // Retry logic
        if (attempt < maxRetries) {
          const retryDelay = RETRY_DELAY * Math.pow(2, attempt); // Exponential backoff
          console.warn(
            `[use-africa-pay] Script load failed, retrying in ${retryDelay}ms (attempt ${attempt + 1}/${maxRetries})`
          );
          await delay(retryDelay);
          try {
            await loadWithRetry(attempt + 1);
            resolve();
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error(`Failed to load script after ${maxRetries} attempts: ${src}`));
        }
      };

      document.body.appendChild(script);
    });
  };

  // Store the promise
  LOADED_SCRIPTS[src] = loadWithRetry();

  return LOADED_SCRIPTS[src];
};

/**
 * Clear loaded scripts cache (useful for testing)
 */
export const clearScriptCache = (): void => {
  Object.keys(LOADED_SCRIPTS).forEach((key) => delete LOADED_SCRIPTS[key]);
};
