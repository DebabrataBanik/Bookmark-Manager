import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Feed from "../components/Feed"
import BookmarkForm from "../components/BookmarkForm"
import { useState } from "react"

const App = () => {

  const [showBookmarkForm, setShowBookmarkForm] = useState(false)

  const closeForm = () => setShowBookmarkForm(false)
  const openForm = () => setShowBookmarkForm(true)

  return (
    <div className="wrapper">
      <div className={`flex flex-col grow ${showBookmarkForm ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <Header onOpen={openForm} />
        <div className="main-wrapper">
          <Sidebar />
          <Feed />
        </div>
      </div>
      {
        showBookmarkForm && <BookmarkForm onClose={closeForm} />
      }
    </div>
  )
}

export default App