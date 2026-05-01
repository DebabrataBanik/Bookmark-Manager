import { useEffect, useState, useRef } from "react"
import Logo from "./subcomponents/Logo"
import { EyeIcon, Clock4Icon, CalendarIcon, PinIcon, EllipsisVerticalIcon, PencilIcon, TrashIcon, ClipboardCopyIcon, ArchiveIcon, ExternalLinkIcon, ArrowUpDownIcon } from 'lucide-react'
import ConfirmDeleteDialog from "./subcomponents/ConfirmDeleteDialog"
import { getDate } from "../utils/getDate"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { archiveBookmark, deleteBookmark, getBookmarks, pinBookmark, updateBookmarkOnVisit } from "../services/bookmarkService"

const Feed = ({ searchInput, selectedTags, onOpen, openDeleteDialog, setOpenDeleteDialog }) => {

  const [openId, setOpenId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [message, setMessage] = useState(null)
  const [sort, setSort] = useState('')

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

  useEffect(() => {
    if(!message) return

    const timer = setTimeout(() => {
      setMessage(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [message])


  const { data: bookmarks = [], isLoading, error } = useQuery({
    queryKey: ['bookmarks', {tags: selectedTags, search: searchInput, sort }],
    queryFn: () => getBookmarks({tags: selectedTags, search: searchInput, sort })
  })

  const queryClient = useQueryClient()

  const pinMutation = useMutation({
    mutationFn: pinBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks']})
    },
    onError: (error) => {
      setMessage({ text: error.message, type: 'error' })
    } 
  })

  const archiveMutation = useMutation({
    mutationFn: archiveBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks']})
      queryClient.invalidateQueries({ queryKey: ['archives']})
      queryClient.invalidateQueries({ queryKey: ['categories']})
    },
    onError: (error) => {
      setMessage({ text: error.message, type: 'error' })
    }
  })

  const onVisitMutation = useMutation({
    mutationFn: updateBookmarkOnVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks']})
    },
    onError: (error) => {
      setMessage({ text: error.message, type: 'error' })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBookmark,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks']})
      queryClient.invalidateQueries({ queryKey: ['categories']})
      handleClose()
      setMessage({ text: data.message, type: 'success' })
    },
    onError: (error) => {
      setMessage({ text: error.message, type: 'error' })
    }
  })

  function handleToggle(id){
    setOpenId(prev => prev === id ? null : id)
  }

  function handleOpenDeleteDialog(id){
    setOpenDeleteDialog(true)
    setDeleteId(id)
  } 

  function handleClose(){
    setOpenDeleteDialog(false)
    setDeleteId(null)
    setOpenId(null)
  }

  function handleEditClick(item){
    onOpen(item)
    setOpenId(null)
  }

  async function handleCopyUrltoClipboard(url){
    try {
      await navigator.clipboard.writeText(url)
    } catch (error) {
      console.error('Failed to copy URL: ', error)
    }
  }

  function handleVisit(url, id){
    window.open(url, '_blank', 'noreferrer')
    onVisitMutation.mutate(id)
  }

  return (
    <main className="p-4 sm:p-8">
      <div className="flex items-center gap-10">
        <h1 className="text-lg font-bold">All bookmarks</h1>
        {
          message && 
          <span className={`text-sm ${message.type === 'success' ? 'text-success' : 'text-error'}`}>{message.text}</span>
        }
        <label className="sort-label">
          <ArrowUpDownIcon aria-hidden='true' className="arrow" size={18} />
          <select 
            aria-label="Sort bookmarks" 
            name="sort"
            value={sort}
            onChange={e => setSort(e.target.value)}
            >
            <option value='' disabled hidden>Sort by</option>
            <option value="add">Recently added</option>
            <option value="visit">Recently visited</option>
            <option value="most">Most visited</option>
          </select>
        </label>
      </div>

      <section className="bookmarks-container">

        {
          isLoading ?
            <p className="text-sm text-text-tertiary">Loading bookmarks...</p>
          :
          !isLoading && error ?
            <p className="text-sm text-error">{error.message}</p>
          :
          (
            bookmarks.length === 0 ? <p className="text-sm text-text-tertiary">No bookmarks to show.</p>
            :
            (
              bookmarks.map(item => { 
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
                    <button
                      ref={openId === item._id ? optionsRef : null}
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
                              onClick={() => handleEditClick(item)}
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
                              Copy Url
                            </button>
                            <button
                              type="button"
                              className="visit-btn"
                              onClick={() => handleVisit(item.url, item._id)}
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
                    <p className="pt-4 ext-sm text-text-secondary border-t border-t-border line-clamp-4">{item.description}</p>
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
                        onClick={() => archiveMutation.mutate(item._id)}
                      >
                        <ArchiveIcon size={14} />
                      </button>
                      <button 
                        onClick={() => pinMutation.mutate(item._id)} 
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
          <ConfirmDeleteDialog onDelete={() => deleteMutation.mutate(deleteId)} onClose={handleClose}>
            This will permanently delete this bookmark. You can archive this instead of deleting.
          </ConfirmDeleteDialog>
        ) 
      }
    </main>
  )
}

export default Feed