export async function getCategories(){
  const res = await fetch('http://localhost:8000/api/categories')
  if(!res.ok){
    const err = await res.json()
    throw new Error(err.message || `Failed to fetch categories: ${res.status} ${res.statusText}`)
  } 
  return res.json()
}