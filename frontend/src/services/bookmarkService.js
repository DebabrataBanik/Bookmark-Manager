export async function addBookmark(data){
  const res = await fetch('http://localhost:8000/api/bookmark/add', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  if(!res.ok){
    const err = await res.json()
    throw new Error(err.message || 'Failed to create bookmark.')
  }
  return res.json()
}

export async function updateBookmark({id, data}){
  const res = await fetch(`http://localhost:8000/api/bookmark/${id}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  if(!res.ok){
    const err = await res.json()
    throw new Error(err.message || "Failed to update bookmark")
  }
  return res.json()
}