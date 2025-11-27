/**
 * Format time in seconds to MM:SS format
 * @param seconds - time in seconds
 * @returns formatted time string in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);
  const mins = Math.floor(absSeconds / 60);
  const secs = absSeconds % 60;

  return `${isNegative ? '-' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format time in seconds to HH:MM:SS format (with hours)
 * @param seconds - time in seconds
 * @returns formatted time string in HH:MM:SS format
 */
export const formatTimeWithHours = (seconds: number): string => {
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);
  const hours = Math.floor(absSeconds / 3600);
  const mins = Math.floor((absSeconds % 3600) / 60);
  const secs = absSeconds % 60;

  return `${isNegative ? '-' : ''}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Capitalizes the first letter of a string
 * @param str - input string
 * @returns capitalized string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Sanitizes user input to prevent XSS
 * @param str - input string
 * @returns sanitized string
 */
export const sanitize = (str: string): string => {
  // In a real implementation, you'd use DOMPurify or similar
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Converts hint code to uppercase for consistent comparison
 * @param code - hint code string
 * @returns uppercase hint code
 */
export const normalizeHintCode = (code: string): string => {
  return code.toUpperCase().trim();
};

/**
 * Validates if a hint code is in the expected format (e.g., "HINT01", "HINT-01")
 * @param code - hint code to validate
 * @returns boolean indicating if code format is valid
 */
export const isValidHintCode = (code: string): boolean => {
  const normalizedCode = normalizeHintCode(code);
  // Pattern: starts with letters, followed by numbers, optionally with hyphens
  const hintCodePattern = /^[A-Za-z]+[-]?[0-9]+$/;
  return hintCodePattern.test(normalizedCode);
};

/**
 * Generates a session ID
 * @returns a unique session ID
 */
export const generateSessionId = (): string => {
  return 'session_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

/**
 * Checks if a game session is expired based on start time and play time
 * @param startTime - session start time in ISO string format
 * @param playTimeMinutes - allowed play time in minutes
 * @returns boolean indicating if session is expired
 */
export const isSessionExpired = (startTime: string, playTimeMinutes: number): boolean => {
  const start = new Date(startTime).getTime();
  const now = Date.now();
  const elapsedMs = now - start;
  const playTimeMs = playTimeMinutes * 60 * 1000;
  return elapsedMs > playTimeMs;
};

/**
 * Calculates the remaining time for a game session
 * @param startTime - session start time in ISO string format
 * @param playTimeMinutes - allowed play time in minutes
 * @returns remaining time in seconds
 */
export const calculateRemainingTime = (startTime: string, playTimeMinutes: number): number => {
  const start = new Date(startTime).getTime();
  const now = Date.now();
  const elapsedMs = now - start;
  const playTimeMs = playTimeMinutes * 60 * 1000;
  const remainingMs = playTimeMs - elapsedMs;
  return Math.max(0, Math.floor(remainingMs / 1000));
};

/**
 * Calculates the progress percentage based on hints used
 * @param currentProgress - current progress percentage
 * @param newProgress - new progress percentage to compare
 * @returns the higher progress percentage
 */
export const calculateProgress = (currentProgress: number, newProgress: number): number => {
  return Math.max(currentProgress, newProgress);
};

/**
 * Formats progress percentage for display
 * @param progress - progress percentage as a number
 * @returns formatted progress string
 */
export const formatProgress = (progress: number): string => {
  return `${Math.min(100, Math.max(0, progress))}%`;
};

/**
 * Calculates progress percentage based on used hints vs total hints
 * @param usedHints - number of hints used
 * @param totalHints - total number of hints available
 * @returns progress percentage
 */
export const calculateHintProgress = (usedHints: number, totalHints: number): number => {
  if (totalHints <= 0) return 0;
  return Math.min(100, Math.floor((usedHints / totalHints) * 100));
};

/**
 * Checks if a theme is active and available for play
 * @param theme - theme object to check
 * @returns boolean indicating if theme is active
 */
export const isThemeActive = (theme: { isActive: boolean; playTime: number }): boolean => {
  return theme.isActive && theme.playTime > 0;
};

/**
 * Generates a formatted title for a theme
 * @param themeName - name of the theme
 * @returns formatted title
 */
export const formatThemeTitle = (themeName: string): string => {
  return capitalize(themeName);
};

/**
 * Checks if an element is currently visible in the viewport
 * @param element - DOM element to check
 * @returns boolean indicating if element is in viewport
 */
export const isElementInViewport = (element: HTMLElement): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

/**
 * Debounces a function call
 * @param func - function to debounce
 * @param wait - time to wait in milliseconds
 * @returns debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>): void {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttles a function call
 * @param func - function to throttle
 * @param limit - time limit in milliseconds
 * @returns throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number) => {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Checks if the current device is a mobile device
 * @returns boolean indicating if current device is mobile
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Gets the current timestamp in ISO format
 * @returns current timestamp as ISO string
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Validates a session ID format
 * @param sessionId - session ID to validate
 * @returns boolean indicating if session ID format is valid
 */
export const isValidSessionId = (sessionId: string): boolean => {
  // Simple validation for session ID format
  return typeof sessionId === 'string' && sessionId.length >= 10;
};