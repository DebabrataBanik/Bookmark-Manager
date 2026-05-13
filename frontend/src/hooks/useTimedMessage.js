import { useEffect, useState } from "react"

export function useTimedMessage(duration = 3000, onClose = null) {
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if(!message) return

    const timer = setTimeout(() => {
      setMessage(null)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  return { message, setMessage }
}