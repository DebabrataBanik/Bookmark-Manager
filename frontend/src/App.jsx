import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Feed from "./components/Feed"
import BookmarkForm from "./components/BookmarkForm"
import Archive from "./components/Archive"
import { useState} from "react"

const App = () => {

  const [showBookmarkForm, setShowBookmarkForm] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [bookmarkData, setBookmarkData] = useState(null)
  const [contentPage, setContentPage] = useState('home')
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const closeForm = () => {
    setBookmarkData(null)
    setShowBookmarkForm(false)
  }
  const openForm = (bookmark) => {
    setBookmarkData(bookmark || null)
    setShowBookmarkForm(true)
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
        inert={showBookmarkForm || openDeleteDialog} 
        className={`flex flex-col grow ${showBookmarkForm ? 'blur-sm pointer-events-none select-none' : ''}`}
      >

        <Header 
          onOpen={openForm} 
          searchInput={searchInput} 
          onSearchChange={handleSearchInputChange}
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
        />
        
        <div className="main-wrapper">
          
          <Sidebar 
            selectedTags={selectedTags} 
            onTagSelect={handleSelectedTags} 
            contentPage={contentPage}
            onArchiveClick={goToArchive}
            onHomeClick={goToHome}
            showSidebar={showSidebar}
          />
          {
            contentPage === 'home' ?
            <Feed
              onOpen={openForm}
              searchInput={searchInput} 
              selectedTags={selectedTags} 
              openDeleteDialog={openDeleteDialog}
              setOpenDeleteDialog={setOpenDeleteDialog}
            /> 
            :
            <Archive 
              openDeleteDialog={openDeleteDialog}
              setOpenDeleteDialog={setOpenDeleteDialog}
            />
          }

        </div>
      </div>
      {
        showBookmarkForm && <BookmarkForm bookmarkData={bookmarkData} onClose={closeForm} />
      }
    </div>
  )
}

export default App