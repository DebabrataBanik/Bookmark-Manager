import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Feed from "../components/Feed"
import BookmarkForm from "../components/BookmarkForm"
import { useState, useEffect } from "react"

const App = () => {

  const [showBookmarkForm, setShowBookmarkForm] = useState(false)
  const [bookmarks, setBookmarks] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    async function getCategories(){
      try {
        const res = await fetch('http://localhost:8000/api/categories')
        if(!res.ok){
          const err = await res.json()
          throw new Error(err.message || `Failed to fetch categories: ${res.status} ${res.statusText}`)
        }
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        console.error(error)
      }
    }
    getCategories()
  }, [bookmarks.length])

  const closeForm = () => setShowBookmarkForm(false)
  const openForm = () => setShowBookmarkForm(true)

  function handleBookmarkAdd(newBookmark){
    setBookmarks(prev => [newBookmark, ...prev])
  }

  function handleSelectedTags(value, checked){
    setSelectedTags(prev => {
      if(!checked) {
        return prev.filter(tag => tag !== value)
      }
      return [...prev, value]
    })
  }

  function handleSearchInputChange(value){
    setSearchInput(value)
  }

  return (
    <div className="wrapper">

      <div className={`flex flex-col grow ${showBookmarkForm ? 'blur-sm pointer-events-none select-none' : ''}`}>

        <Header 
          onOpen={openForm} 
          searchInput={searchInput} 
          onSearchChange={handleSearchInputChange} 
        />
        
        <div className="main-wrapper">
          
          <Sidebar 
            categories={categories}
            selectedTags={selectedTags} 
            onTagSelect={handleSelectedTags} 
          />
          <Feed
            searchInput={searchInput} 
            selectedTags={selectedTags} 
            setBookmarks={setBookmarks} 
            bookmarks={bookmarks} 
          />

        </div>
      </div>
      {
        showBookmarkForm && <BookmarkForm onClose={closeForm} onBookmarkAdd={handleBookmarkAdd} />
      }
    </div>
  )
}

export default App