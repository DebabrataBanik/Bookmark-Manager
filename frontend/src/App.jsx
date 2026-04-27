import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Feed from "./components/Feed"
import BookmarkForm from "./components/BookmarkForm"
import Archive from "./components/Archive"
import { useState, useEffect } from "react"

const App = () => {

  const [showBookmarkForm, setShowBookmarkForm] = useState(false)
  const [bookmarks, setBookmarks] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [categories, setCategories] = useState([])
  const [bookmarkData, setBookmarkData] = useState(null)
  const [contentPage, setContentPage] = useState('home')

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

  useEffect(() => {
    getCategories()
  }, [])

  const closeForm = () => {
    setBookmarkData(null)
    setShowBookmarkForm(false)
  }
  const openForm = (id) => {
    if(id) {
      const existingBookmark = bookmarks.find(b => b._id === id)
      setBookmarkData(existingBookmark)
    }
    setShowBookmarkForm(true)
  }

  function handleBookmarkUpdate(updatedBookmark){
    setBookmarks(prev => prev.map(item => item._id === updatedBookmark._id ? updatedBookmark : item))
    getCategories()
  }

  function handleBookmarkAdd(newBookmark){
    setBookmarks(prev => [newBookmark, ...prev])
    getCategories()
  }

  function handleBookmarkDelete(id){
    setBookmarks(prev => prev.filter(item => item._id !== id))
    getCategories()
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

  function goToArchive(){
    setContentPage('archive')
  }
  function goToHome(){
    setContentPage('home')
  }

  return (
    <div className="wrapper">

      <div
        inert={showBookmarkForm} 
        className={`flex flex-col grow ${showBookmarkForm ? 'blur-sm pointer-events-none select-none' : ''}`}
      >

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
            contentPage={contentPage}
            onArchiveClick={goToArchive}
            onHomeClick={goToHome}
          />
          {
            contentPage === 'home' ?
            <Feed
              onOpen={openForm}
              onBookmarkDelete={handleBookmarkDelete}
              searchInput={searchInput} 
              selectedTags={selectedTags} 
              setBookmarks={setBookmarks} 
              bookmarks={bookmarks}
              getCategories={getCategories}
            /> 
            :
            <Archive />
          }

        </div>
      </div>
      {
        showBookmarkForm && <BookmarkForm bookmarkData={bookmarkData} onClose={closeForm} onBookmarkAdd={handleBookmarkAdd} onBookmarkUpdate={handleBookmarkUpdate} />
      }
    </div>
  )
}

export default App