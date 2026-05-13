import { useEffect, useState, useRef } from "react"
import { getDate } from "../utils/getDate"
import Logo from "./subcomponents/Logo"
import { TrashIcon, ArchiveRestoreIcon } from 'lucide-react'
import ConfirmDeleteDialog from "./subcomponents/ConfirmDeleteDialog"
import { useQuery } from "@tanstack/react-query"
import { getArchives} from "../services/bookmarkService"
import BookmarksSkeleton from "./skeletons/BookmarksSkeleton"
import BookmarkCard from "./subcomponents/Bookmark"
import { useTimedMessage } from "../hooks/useTimedMessage"
import { useDeleteBookmark } from "../hooks/useDeleteBookmark"
import { useArchiveMutation } from "../hooks/useArchiveMutation"

const Archive = ({ openDeleteDialog, setOpenDeleteDialog }) => {

  const [openId, setOpenId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const { message, setMessage } = useTimedMessage()

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

  const { data: archivedBookmarks = [], isLoading, error } = useQuery({
    queryKey: ['archives'],
    queryFn: getArchives
  })

  const restoreMutation = useArchiveMutation(handleClose, setMessage)

  const deleteMutation = useDeleteBookmark(handleClose, setMessage)

  function handleRestore(id){
    restoreMutation.mutate({id, state: false})
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
          <span className={`text-sm ${message.type === 'success' ? 'text-success' : 'text-error'}`}>{message.text}</span>
        }
      </div>

      <section aria-busy={isLoading} className="bookmarks-container">

        {
          isLoading ?
            <BookmarksSkeleton />
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
                <BookmarkCard key={item._id}>
                  <BookmarkCard.Header item={item} openId={openId} optionsRef={optionsRef} handleToggle={handleToggle}>
                    <div className='p-1 gap-1'>
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
                  </BookmarkCard.Header>
                  <BookmarkCard.Details  item={item} />
                  <BookmarkCard.Footer item={item} lastVisited={lastVisited} dateAdded={dateAdded} />
                </BookmarkCard>
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