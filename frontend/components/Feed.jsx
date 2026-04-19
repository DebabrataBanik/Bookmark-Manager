import { useEffect, useState } from "react"
import { nanoid } from 'nanoid'

const Feed = () => {

  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function getData(){
      setError(null)
      try {
        const res = await fetch('http://localhost:8000/api')
        if(!res.ok){
          const err = await res.json()
          throw new Error(data.message || `HTTP: ${res.status}: ${res.statusText}`)
        }
        const data = await res.json()
        setBookmarks(data)

      } catch (error) {
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          setError("Server is not running or still starting")
        } else {
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

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
                    <div className="">
                      <h2 className="font-bold">{item.title}</h2>
                      <span className="text-xs text-text-secondary">{item.domain}</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary px-4">{item.description}</p>
                  <div className="px-4 pb-4 flex items-center mt-auto gap-1">
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