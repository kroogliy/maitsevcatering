import { useState, useEffect, useRef } from 'react';

export default function useDebouncedSearch(initialValue = '', delay = 500) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);
  const timeoutRef = useRef();

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [searchTerm, delay]);

  return [searchTerm, debouncedTerm, setSearchTerm];
}