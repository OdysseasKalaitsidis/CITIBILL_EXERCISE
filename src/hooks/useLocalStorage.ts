import { useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        if (Array.isArray(initial) && !Array.isArray(parsed)) {
          return initial;
        }
        return parsed;
      }
      return initial;
    } catch {
      return initial;
    }
  });

  const set = (v: T) => {
    try {
      setValue(v);
      localStorage.setItem(key, JSON.stringify(v));
    } catch (error) {
      console.warn("localStorage write failed:", error);
    }
  };

  return [value, set] as const;
}
