import { useEffect, useState } from 'react';

// Debounce search optimization
export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // Start a timer
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup: cancel previous timer if value changes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
