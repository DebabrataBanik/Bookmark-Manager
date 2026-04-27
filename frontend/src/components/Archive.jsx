import { useEffect, useState } from "react"
import { getDate } from "../utils/getDate"
import Logo from "./subcomponents/Logo"
import { EyeIcon, Clock4Icon, CalendarIcon, PinIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, ClipboardCopyIcon, ArchiveIcon, ExternalLinkIcon } from 'lucide-react'


const Archive = () => {

  const [archivedBookmarks, setArchivedBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function getArchives(){
      try {
        const res = await fetch('http://localhost:8000/api/bookmarks/archive')
        const data = await res.json()
        if(!res.ok){
          throw new Error(data.message || `Error: ${res.status} ${res.statusText}`)
        }
        setArchivedBookmarks(data)

      } catch (error) {
        if (error instanceof TypeError && error.message === "Failed to fetch") {
          setError("Server is unreachable.")
        } else {
          console.error(error)
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    }
    getArchives()
  }, [])

  return (
    <main>
      <div className="flex items-center gap-10">
        <h1 className="text-lg font-bold">Your Archive</h1>
      </div>

      <section className="bookmarks-container">

        {
          loading ?
            <p className="text-sm text-text-tertiary">Loading archives...</p>
          :
          !loading && error ?
            <p className="text-sm text-error">{error}</p>
          :
          (
            archivedBookmarks.length === 0 ? <p className="text-sm text-text-tertiary">Nothing to show.</p>
            :
            (
              archivedBookmarks.map(item => { 
                const dateAdded = getDate(item.createdAt)
                const lastVisited = getDate(item.lastVisited)

              return (
                <article key={item._id}>
                  <div className="flex items-center gap-4 p-4">
                    <Logo domain={item.domain} />
                    <div>
                      <h2 className="font-bold text-lg">{item.title}</h2>
                      <span className="text-xs text-text-secondary">{item.domain}</span>
                    </div>
                    
                  </div>
                  <div className="px-4 text-sm">
                    <p className="pt-4 ext-sm text-text-secondary border-t border-t-border">{item.description}</p>
                    <div className="py-4 flex items-center mt-auto gap-2">
                      {
                        item.category.map(tag => <span key={tag} className="tags">{tag}</span>)
                      }
                    </div>
                  </div>
                  <div className="article-footer">
                    <div className="flex items-center gap-5">
                      <span title="View count" className="stat">
                        <EyeIcon size={12} />
                        {item.count}
                      </span>
                      <span title="Last visited" className="stat">
                        <Clock4Icon size={12} />
                        {lastVisited}
                      </span>
                      <span title="Date Added" className="stat">
                        <CalendarIcon size={12} />
                        {dateAdded}
                      </span>
                    </div>
                    
                  </div>
                </article>
              )})
            )
          )
        }
      </section>
      
    </main>
  )
}

export default Archive