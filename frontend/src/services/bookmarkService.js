const BASE_URL = import.meta.env.VITE_BASE_URL

export async function getBookmarks({tags, search, sort}){ 
  const params = new URLSearchParams()
  if(tags?.length > 0) params.set('category', tags.join(','))
  if(search?.trim()) params.set('search', search.trim())
  if(sort) params.set('sortBy', sort)

  const url = `${BASE_URL}/api/bookmarks?${params.toString()}`
  const res = await fetch(url)
  if(!res.ok){
    const err = await res.json()
    throw new Error(err.message || 'Failed to fetch bookmarks')
  }
  return res.json()
}

export async function addBookmark(data){
  const res = await fetch(`${BASE_URL}/api/bookmarks`, {
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
  const res = await fetch(`${BASE_URL}/api/bookmarks/${id}`, {
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
  const res = await fetch(`${BASE_URL}/api/bookmarks?archived=true`)
  if(!res.ok){
    const err = await res.json()
    throw new Error(err.message || 'Failed to get archived bookmarks')
  }

  return res.json()
}

export async function setArchive(id, state){
  const res = await fetch(`${BASE_URL}/api/bookmarks/${id}/archive`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ state })
  })
  if(!res.ok){
    const err = await res.json()
    throw Error(err.message || 'Failed to update archive state')
  }
  return res.json()
}

export async function deleteBookmark(id){
  const res = await fetch(`${BASE_URL}/api/bookmarks/${id}`, {
    method: 'DELETE'
  })
  if(!res.ok){
    const err = await res.json()
    throw Error(err.message || 'Failed to delete bookmark')
  }
  return res.json()
}

export async function pinBookmark(id){
  const res = await fetch(`${BASE_URL}/api/bookmarks/${id}/pin`, {
    method: 'PATCH'
  })
  if(!res.ok){
    const data = await res.json()
    throw Error(data.message || 'Failed to pin bookmark')
  }
  return res.json()
}

export async function updateBookmarkOnVisit(id){
  const res = await fetch(`${BASE_URL}/api/bookmarks/${id}/visit`, {
    method: 'PATCH'
  })
  if(!res.ok){
    const data = await res.json()
    throw new Error(data.message || 'Failed to update bookmark')
  }
  return res.json()
}