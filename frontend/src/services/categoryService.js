const BASE_URL = import.meta.env.VITE_BASE_URL

export async function getCategories(){
  const res = await fetch(`${BASE_URL}/api/categories`)
  if(!res.ok){
    const err = await res.json()
    throw new Error(err.message || `Failed to fetch categories: ${res.status} ${res.statusText}`)
  } 
  return res.json()
}