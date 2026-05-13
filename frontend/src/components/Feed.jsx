import { useEffect, useState, useRef } from "react"
import Logo from "./subcomponents/Logo"
import { PinIcon, PencilIcon, TrashIcon, ClipboardCopyIcon, ArchiveIcon, ExternalLinkIcon, ArrowUpDownIcon,  ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import ConfirmDeleteDialog from "./subcomponents/ConfirmDeleteDialog"
import { getDate } from "../utils/getDate"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { setArchive, deleteBookmark, getBookmarks, pinBookmark, updateBookmarkOnVisit, getPinnedBookmarks } from "../services/bookmarkService"
import { useDebounce } from "../hooks/useDebounce"
import BookmarksSkeleton from "./skeletons/BookmarksSkeleton"
import BookmarkCard from "./subcomponents/Bookmark"

const Feed = ({ searchInput, selectedTags, onOpen, openDeleteDialog, setOpenDeleteDialog }) => {

  const [openId, setOpenId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [message, setMessage] = useState(null)
  const [sort, setSort] = useState('')
  // const [delayed, setDelayed] = useState(false)

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

  const debouncedSearchInput = useDebounce(searchInput)

  const { data: bookmarks = [], isLoading, error } = useQuery({
    queryKey: ['bookmarks', {tags: selectedTags, search: debouncedSearchInput, sort }],
    queryFn: () => getBookmarks({tags: selectedTags, search: debouncedSearchInput, sort })
  })

  const { data: pinnedBookmarks = []} = useQuery({
    queryKey: ['pinned'],
    queryFn: getPinnedBookmarks
  })

  const queryClient = useQueryClient()

  const pinMutation = useMutation({
    mutationFn: pinBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks']})
      queryClient.invalidateQueries({ queryKey: ['pinned']})
    },
    onError: (error) => {
      setMessage({ text: error.message, type: 'error' })
    } 
  })

  const archiveMutation = useMutation({
    mutationFn: ({id, state}) => setArchive(id, state),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks']})
      queryClient.invalidateQueries({ queryKey: ['archives']})
      queryClient.invalidateQueries({ queryKey: ['categories']})
      queryClient.invalidateQueries({ queryKey: ['pinned']})
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
      queryClient.invalidateQueries({ queryKey: ['pinned']})
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

  const scrollRef = useRef(null)

  function scrollLeft(){
    if(scrollRef.current){
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  function scrollRight(){
    if(scrollRef.current){
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  // useEffect(() => {
  //   let timer
  //   if (isLoading) {
  //     timer = setTimeout(() => {
  //       setDelayed(true)
  //     }, 2000)
  //   } else {
  //     timer = setTimeout(() => {
  //       setDelayed(false)
  //     }, 0)
  //   }
  //   return () => clearTimeout(timer)
  // }, [isLoading])

  // const loadingText = isLoading ? delayed ? 'This is taking longer than usual...' : 'Loading bookmarks...' : ''

  return (
    <main className="p-4 sm:p-8 overflow-hidden">
      {
        pinnedBookmarks?.length > 0 && (
        <div className="flex items-center sm:gap-2 mb-4 w-full"> 
          <ChevronLeftIcon
            role="button"
            tabIndex={0}
            aria-label="Scroll left"
            size={15} 
            className="text-text-tertiary shrink-0 cursor-pointer outline-none hover:text-text-primary focus-visible:text-text-primary transition-colors duration-300"
            onClick={scrollLeft}
          />
          <div ref={scrollRef} className="flex items-center gap-2 overflow-x-scroll whitespace-nowrap scrollbar-none">
            {
              pinnedBookmarks.map(item => (
                <button
                  key={item._id}
                  onClick={() => handleVisit(item.url, item._id)}
                  aria-label={`Visit ${item.domain}`}
                  type="button" 
                  className="max-w-25 sm:max-w-50 pinned-item shadow-sm shrink-0" 
                  title="Visit site" 
                >
                  <p className="line-clamp-1">{item.title}</p>
                  <span className="font-mono text-text-tertiary font-normal line-clamp-1">{item.domain}</span>
                </button>
              ))
            }
          </div>
          <ChevronRightIcon
            role="button"
            tabIndex={0}
            aria-label="Scroll right"
            size={15} 
            className="shrink-0 text-text-tertiary cursor-pointer ml-auto outline-none hover:text-text-primary focus-visible:text-text-primary transition-colors duration-300"
            onClick={scrollRight}
          />
        </div>
      )}

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

      <section aria-busy={isLoading} className="bookmarks-container">

        {
          isLoading ?
            <BookmarksSkeleton />
          :
          error ?
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
                <BookmarkCard key={item._id}>
                  <BookmarkCard.Header item={item} openId={openId} optionsRef={optionsRef} handleToggle={handleToggle}>
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
                        className="archive-btn"
                        disabled={archiveMutation.isPending}
                        onClick={() => archiveMutation.mutate({id:item._id, state: true})}
                      >
                        <ArchiveIcon size={12} />
                        Archive
                      </button>
                      <button 
                        type="button" 
                        className="delete-btn"
                        disabled={deleteMutation.isPending}
                        onClick={() => handleOpenDeleteDialog(item._id)}
                        >
                        <TrashIcon size={12} /> 
                        Delete 
                      </button>
                    </div>
                  </BookmarkCard.Header>
                  <BookmarkCard.Details item={item} />
                  <BookmarkCard.Footer item={item} lastVisited={lastVisited} dateAdded={dateAdded}>
                    <button 
                      onClick={() => pinMutation.mutate(item._id)} 
                      title="Pin"
                      disabled={pinMutation.isPending} 
                      type="button"
                    >
                      <PinIcon className={item.pinned ? 'pinned' : ''} size={15} />
                    </button>
                  </BookmarkCard.Footer>
                </BookmarkCard>
              )})
            )
          )
        }
      </section>
      {
        openDeleteDialog && ( 
          <ConfirmDeleteDialog disabled={deleteMutation.isPending} onDelete={() => deleteMutation.mutate(deleteId)} onClose={handleClose}>
            This will permanently delete this bookmark. You can archive this instead of deleting.
          </ConfirmDeleteDialog>
        ) 
      }
    </main>
  )
}

export default Feed