import { useEffect, useState } from "react"
import { nanoid } from 'nanoid'
import Logo from "./Logo"

const Feed = ({ searchInput, selectedTags, setBookmarks, bookmarks }) => {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const params = new URLSearchParams()
  
  if(selectedTags.length > 0){
    params.set('category', selectedTags.join(','))
  }
  if(searchInput.trim()){
    params.set('search', searchInput.trim())
  }
  const url = `http://localhost:8000/api?${params.toString()}`

  useEffect(() => {
    async function getData(){ 
      setError(null)
      try {
        const res = await fetch(url)
        if(!res.ok){
          const err = await res.json()
          throw new Error(err.message || `HTTP: ${res.status}: ${res.statusText}`)
        }
        const data = await res.json()
        setBookmarks(data)

      } catch (error) {
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          setError("Server is unreachable.")
        } else {
          console.log(error)
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [selectedTags, searchInput])

  return (
    <main>
      <div>
        <h1 className="text-lg font-bold">All bookmarks</h1>
      </div>

      <section className="bookmarks-container">

        {
          loading ?
            <p className="text-sm text-text-tertiary">Loading bookmarks...</p>
          :
          !loading && error ?
            <p className="text-sm text-error">{error}</p>
          :
          (
            bookmarks.length === 0 ? <p className="text-sm text-text-tertiary">No bookmarks to show.</p>
            :
            (
              bookmarks.map(item => (
                <article key={item._id}>
                  <div className="flex items-center gap-4 border-b border-b-border py-3 px-4">
                    {/* <Logo domain={item.domain} /> */}
                    <div>
                      <h2 className="font-bold">{item.title}</h2>
                      <span className="text-xs text-text-secondary">{item.domain}</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary px-4">{item.description}</p>
                  <div className="px-4 pb-4 flex items-center mt-auto gap-2">
                    {
                      item.category.map(tag => <span key={nanoid()} className="tags">{tag}</span>)
                    }
                  </div>
                </article>
              ))
            )
          )
        }
      </section>
    </main>
  )
}

export default Feed