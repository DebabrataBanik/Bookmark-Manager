import { useState, useEffect, useRef } from "react"

export function useOptions(){
  const [openId, setOpenId] = useState(null)

  const optionsRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(e) {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setOpenId(null)
      }
    }
    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])

  function handleToggle(id){
    setOpenId(prev => prev === id ? null : id)
  }

  return { openId, optionsRef, handleToggle }
}