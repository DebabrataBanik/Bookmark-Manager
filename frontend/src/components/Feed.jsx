import { useEffect, useState, useRef } from "react"
import Logo from "./subcomponents/Logo"
import { EyeIcon, Clock4Icon, CalendarIcon, PinIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, ClipboardCopyIcon, ArchiveIcon, ExternalLinkIcon } from 'lucide-react'
import ConfirmDeleteDialog from "./subcomponents/ConfirmDeleteDialog"
import { getDate } from "../utils/getDate"

const Feed = ({ searchInput, selectedTags, setBookmarks, bookmarks, onBookmarkDelete, onOpen, getCategories }) => {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openId, setOpenId] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [message, setMessage] = useState(null)
  const [copied, setCopied] = useState(false)

  const optionsRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(e) {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setOpenId(null)
      }
    }
    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])

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
          console.error(error)
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [selectedTags, searchInput])

  useEffect(() => {
    if(!message) return

    const timer = setTimeout(() => {
      setMessage(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [message])

  async function pinBookmark(id){
    try {
      const res = await fetch(`http://localhost:8000/api/bookmark/${id}`, {
        method: 'PATCH'
      })
      const data = await res.json()
      if(!res.ok){
        throw Error(data.message || `Error : ${res.status} ${res.statusText}`)
      }
      setBookmarks(prev => prev.map(item => item._id === data._id ? data : item))

    } catch (error) {
      console.error(error)
    }
  }

  async function archiveBookmark(id){
    try {
      const res = await fetch(`http://localhost:8000/api/bookmark/archive/${id}`, {
        method: 'PATCH'
      })
      const data = await res.json()
      if(!res.ok){
        throw Error(data.message || `Error: ${res.status} ${res.statusText}`)
      }
      setBookmarks(prev => prev.map(item => item._id === data._id ? data : item))
      await getCategories()

    } catch (error) {
      console.error(error)
    }
  }

  async function handleDelete(){
    if(!selectedId) return

    setMessage(null)
    try {
      const res = await fetch(`http://localhost:8000/api/bookmark/${selectedId}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if(!res.ok){
        setMessage({ success: false, text: data.message })
        return
      }
      setMessage({ success: true, text: data.message })
      onBookmarkDelete(selectedId)
    } catch (error) {
      console.error(error)
      setMessage({ success: false, text: 'Network error' })
    } finally {
      handleClose()
    }
  }

  function handleToggle(id){
    setOpenId(prev => prev === id ? null : id)
  }

  function handleOpenDeleteDialog(id){
    setOpenDeleteDialog(true)
    setSelectedId(id)
  } 

  function handleClose(){
    setOpenDeleteDialog(false)
    setSelectedId(null)
    setOpenId(null)
  }

  function handleEditClick(id){
    onOpen(id)
    setOpenId(null)
  }

  async function handleCopyUrltoClipboard(url){
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL: ', error)
    }
  }

  function handleVisit(url){
    window.open(url, '_blank', 'noreferrer')
  }

  const displayBookmarks = bookmarks.filter(b => !b.archived)

  return (
    <main>
      <div className="flex items-center gap-10">
        <h1 className="text-lg font-bold">All bookmarks</h1>
        {
          message && 
          <span className={`text-sm ${message.success ? 'text-success' : 'text-error'}`}>{message.text}</span>
        }
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
            displayBookmarks.length === 0 ? <p className="text-sm text-text-tertiary">No bookmarks to show.</p>
            :
            (
              displayBookmarks.map(item => { 
                const dateAdded = getDate(item.createdAt)
                const lastVisited = getDate(item.lastVisited)

              return (
                <article ref={openId === item._id ? optionsRef : null} key={item._id}>
                  <div className="flex items-center gap-4 p-4">
                    <Logo domain={item.domain} />
                    <div>
                      <h2 className="font-bold text-lg">{item.title}</h2>
                      <span className="text-xs text-text-secondary">{item.domain}</span>
                    </div>
                    <button 
                      onClick={() => handleToggle(item._id)} type="button" className="modify-btn"
                    >
                      <EllipsisVerticalIcon size={20} />
                    </button>
                    {
                      openId === item._id && (
                        <div className='options'>
                          <div className="w-full p-1 border-b border-b-border flex flex-col gap-0.5">
                            <button 
                              type="button" 
                              className="edit-btn"
                              onClick={() => handleEditClick(item._id)}
                            >
                              <PencilIcon size={12} />
                              Edit 
                            </button>
                            <button
                              type="button"
                              className="copy-btn"
                              onClick={() => handleCopyUrltoClipboard(item.url)}
                            >
                              <ClipboardCopyIcon size={12} />
                              {
                                copied ? 'Copied' : 'Copy Url'
                              }
                            </button>
                            <button
                              type="button"
                              className="visit-btn"
                              onClick={() => handleVisit(item.url)}
                              aria-label={`Visit ${item.domain}`}
                            >
                              <ExternalLinkIcon size={12} />
                              Open Link
                            </button>
                          </div>
                          <div className="p-1 w-full">
                            <button 
                              type="button" 
                              className="delete-btn"
                              onClick={() => handleOpenDeleteDialog(item._id)}
                              >
                              <TrashIcon size={12} /> 
                              Delete 
                            </button>
                          </div>
                        </div>
                      )
                    }

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
                    <div className="flex gap-3 items-start">
                      <button
                        title="Archive"
                        onClick={() => archiveBookmark(item._id)}
                      >
                        <ArchiveIcon size={14} />
                      </button>
                      <button 
                        onClick={() => pinBookmark(item._id)} 
                        title="Pin" 
                        type="button"
                      >
                        <PinIcon className={item.pinned ? 'pinned' : ''} size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              )})
            )
          )
        }
      </section>
      {
        openDeleteDialog && ( 
          <ConfirmDeleteDialog onDelete={handleDelete} onClose={handleClose}>
            This will permanently delete this bookmark. You can archive this instead of deleting.
          </ConfirmDeleteDialog>
        ) 
      }
    </main>
  )
}

export default Feed