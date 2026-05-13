const BASE_URL = import.meta.env.VITE_BASE_URL

async function bookmarkRequest(endpoint, options = {}){
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options)
    if(!res.ok){
      const err = await res.json()
      throw new Error(err.message || 'Bookmark request failed')
    }
    return res.json()
  } catch (error) {
    if(error instanceof TypeError && error.message === 'Failed to fetch'){
      throw new Error('Cannot connect to the server. Please check your internet connection and try again.')
    }
    throw error
  }
}

export async function getBookmarks({tags, search, sort}){ 
  const params = new URLSearchParams()
  if(tags?.length > 0) params.set('category', tags.join(','))
  if(search?.trim()) params.set('search', search.trim())
  if(sort) params.set('sortBy', sort)
 
  return bookmarkRequest(`/api/bookmarks?${params.toString()}`)
}

export async function addBookmark(data){
  return bookmarkRequest('/api/bookmarks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export async function updateBookmark({id, data}){
  return bookmarkRequest(`/api/bookmarks/${id}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
}

export async function getArchives(){
  return bookmarkRequest('/api/bookmarks?archived=true')
}

export async function setArchive(id, state){
  return bookmarkRequest(`/api/bookmarks/${id}/archive`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ state })
  })
}

export async function deleteBookmark(id){
  return bookmarkRequest(`/api/bookmarks/${id}`, {
    method: 'DELETE'
  })
}

export async function pinBookmark(id){
  return bookmarkRequest(`/api/bookmarks/${id}/pin`, {
    method: 'PATCH'
  })
}

export async function updateBookmarkOnVisit(id){
  return bookmarkRequest(`/api/bookmarks/${id}/visit`, {
    method: 'PATCH'
  })
}

export async function getPinnedBookmarks(){
  return bookmarkRequest('/api/bookmarks?pinned=true')
}