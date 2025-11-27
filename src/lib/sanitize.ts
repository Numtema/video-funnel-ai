/**
 * Sanitize data to remove circular references and non-serializable objects
 */
export function sanitizeData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Handle primitives
  if (typeof obj !== 'object') {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeData(item)) as T;
  }

  // Handle objects - create a clean copy with only serializable properties
  const cleaned: any = {};
  
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    
    const value = (obj as any)[key];
    
    // Skip functions, symbols, and DOM elements
    if (typeof value === 'function' || typeof value === 'symbol') {
      continue;
    }
    
    // Skip DOM nodes and Window objects
    if (value && typeof value === 'object') {
      if (value instanceof Node || value instanceof Window || value instanceof Event) {
        continue;
      }
    }
    
    // Recursively sanitize nested objects
    try {
      cleaned[key] = sanitizeData(value);
    } catch (error) {
      // Skip properties that can't be sanitized
      console.warn(`Could not sanitize property ${key}:`, error);
    }
  }
  
  return cleaned as T;
}

/**
 * Ensure data is JSON-serializable by attempting to stringify and parse
 */
export function ensureSerializable<T>(data: T): T {
  try {
    const sanitized = sanitizeData(data);
    // Test if it's serializable
    JSON.parse(JSON.stringify(sanitized));
    return sanitized;
  } catch (error) {
    console.error('Data serialization error:', error);
    // Return a minimal safe version
    return {} as T;
  }
}
