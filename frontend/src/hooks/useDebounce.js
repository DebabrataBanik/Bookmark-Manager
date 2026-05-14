import { useState, useEffect } from "react"

export function useDebounce(value, delay = 500){
  const [debouncedVal, setDebouncedVal] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVal(value)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedVal
}