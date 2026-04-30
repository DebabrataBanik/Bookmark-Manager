import { useEffect, useState, useRef } from "react"
import { getDate } from "../utils/getDate"
import Logo from "./subcomponents/Logo"
import { EyeIcon, Clock4Icon, CalendarIcon, EllipsisVerticalIcon, TrashIcon, ArchiveRestoreIcon } from 'lucide-react'
import ConfirmDeleteDialog from "./subcomponents/ConfirmDeleteDialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deleteBookmark, getArchives, restoreBookmark } from "../services/bookmarkService"

const Archive = ({ openDeleteDialog, setOpenDeleteDialog }) => {

  const [openId, setOpenId] = useState(null)
  const [message, setMessage] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

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

  const { data: archivedBookmarks = [], isLoading, error } = useQuery({
    queryKey: ['archives'],
    queryFn: getArchives
  })
  
  const queryClient = useQueryClient()
  
  const restoreMutation = useMutation({
    mutationFn: restoreBookmark,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['categories']})
      queryClient.invalidateQueries({ queryKey: ['bookmarks']})
      queryClient.invalidateQueries({ queryKey: ['archives']})
      handleClose()
      setMessage({ text: data.message, type: 'success' })
    },
    onError: (error) => {
      setMessage({ text: error.message, type: 'error' })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBookmark,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks']})
      queryClient.invalidateQueries({ queryKey: ['archives']})
      handleClose()
      setMessage({ text: data.message, type: 'success' })
    },
    onError: (error) => {
      setMessage({ text: error.message, type: 'error' })
    }
  })

  function handleRestore(id){
    restoreMutation.mutate(id)
  }

  function handleDelete(id){
    deleteMutation.mutate(id)
  }

  function handleClose(){
    setOpenDeleteDialog(false)
    setOpenId(null)
    setDeleteId(null)
  }

  function handleToggle(id){
    setOpenId(prev => prev === id ? null : id)
  }

  function handleOpenDeleteDialog(id){
    setDeleteId(id)
    setOpenDeleteDialog(true)
  } 

  const isMutating =
  restoreMutation.isPending || deleteMutation.isPending

  return (
    <main className="p-4 sm:p-8">
      <div className="flex items-center gap-10">
        <h1 className="text-lg font-bold">Your Archive</h1>
        {
          message && 
          <span className={`text-sm ${message.success ? 'text-success' : 'text-error'}`}>{message.text}</span>
        }
      </div>

      <section className="bookmarks-container">

        {
          isLoading ?
            <p className="text-sm text-text-tertiary">Loading archives...</p>
          :
          !isLoading && error ?
            <p className="text-sm text-error">{error.message}</p>
          :
          (
            archivedBookmarks.length === 0 ? <p className="text-sm text-text-tertiary">Nothing to show.</p>
            :
            (
              archivedBookmarks.map(item => { 
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
                        <div className='options p-1 gap-1'>
                            <button
                              type="button"
                              className="visit-btn"
                              disabled={isMutating}
                              onClick={() => handleRestore(item._id)}
                            >
                              <ArchiveRestoreIcon size={12} />
                              Restore
                            </button>
                            <button 
                              type="button" 
                              className="delete-btn"
                              onClick={() => handleOpenDeleteDialog(item._id)}
                              >
                              <TrashIcon size={12} /> 
                              Delete 
                            </button>
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
                  </div>
                </article>
              )})
            )
          )
        }
      </section>
      {
        openDeleteDialog && (
          <ConfirmDeleteDialog disabled={isMutating} onDelete={() => handleDelete(deleteId)} onClose={handleClose}>
            Are you sure you want to delete this bookmark.
          </ConfirmDeleteDialog>
        )
      }
    </main>
  )
}

export default Archive