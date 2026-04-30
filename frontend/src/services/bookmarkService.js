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

export async function getArchives(){
  const res = await fetch('http://localhost:8000/api/bookmarks/archive')
  if(!res.ok){
    const err = await res.json()
    throw new Error(err.message || 'Failed to get archived bookmarks')
  }

  return res.json()
}

export async function restoreBookmark(id){
  const res = await fetch(`http://localhost:8000/api/bookmark/archive/${id}`, {
    method: 'PATCH'
  })
  if(!res.ok){
    const err = await res.json()
    throw Error(err.message || 'Failed to restore bookmark')
  }
  return res.json()
}

export async function deleteBookmark(id){
  const res = await fetch(`http://localhost:8000/api/bookmark/${id}`, {
    method: 'DELETE'
  })
  if(!res.ok){
    const err = await res.json()
    throw Error(err.message || 'Failed to delete bookmark')
  }
  return res.json()
}