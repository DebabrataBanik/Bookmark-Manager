export async function getBookmarks(url){ 
  const res = await fetch(url)
  if(!res.ok){
    const err = await res.json()
    throw new Error(err.message || 'Failed to fetch bookmarks')
  }
  return res.json()
}

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
    throw new Error(err.message || 'Failed to create bookmark')
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

export async function pinBookmark(id){
  const res = await fetch(`http://localhost:8000/api/bookmark/${id}`, {
    method: 'PATCH'
  })
  if(!res.ok){
    const data = await res.json()
    throw Error(data.message || 'Failed to pin bookmark')
  }
  return res.json()
}

export async function archiveBookmark(id){
  const res = await fetch(`http://localhost:8000/api/bookmark/archive/${id}`, {
    method: 'PATCH'
  })
  if(!res.ok){
    const data = await res.json()
    throw Error(data.message || 'Failed to archive bookmark')
  }
  return res.json()
}

export async function updateBookmarkOnVisit(id){
  const res = await fetch(`http://localhost:8000/api/bookmark/${id}/visit`, {
    method: 'PATCH'
  })
  if(!res.ok){
    const data = await res.json()
    throw new Error(data.message || 'Failed to update bookmark')
  }
  return res.json()
}