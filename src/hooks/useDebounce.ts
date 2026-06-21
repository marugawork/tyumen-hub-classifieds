import { useEffect, useState } from "react";

/**
 * Debounce a rapidly-changing value. Useful for search inputs and filter
 * controls so we don't refetch / refilter on every keystroke.
 */
export function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
