import { useEffect, useRef } from "react"

const BookmarkForm = ({ onClose }) => {
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if(wrapperRef.current && !wrapperRef.current.contains(e.target)){
        onClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [onClose])

  function handleSubmit(e){
    e.preventDefault()

  }

  return (
    <div ref={wrapperRef} className="form-wrapper">
      <form onSubmit={handleSubmit} className="bookmark-form">
        <h1 className="text-xl font-bold mb-2 mx-2">Add Bookmark</h1>

        <div className="flex gap-2">
          <label className="w-1/2 form-label">
            <span className="ml-1">URL</span>
            <input 
              type="text" 
              name="url"
              className="form-input"
              placeholder="https://example.com"
              title="Enter a valid URL starting with http:// or https://"
            /> 
          </label>

          <label className="w-1/2 form-label">
            <span className="ml-1">Title</span>
            <input 
              type="text" 
              name="title"
              className="form-input"
              placeholder="e.g. React Docs, CSS Tricks Guide"
              title="Enter a short, clear title (3–80 characters)."
              />
          </label>
        </div>

        <label className="form-label">
          <span className="ml-1">Description</span>
          <textarea 
            type="text"
            name="description"
            className="form-input"
            title="Enter a well described summary for your bookmark."
          />
        </label>

        <label className="form-label">
          <span className="ml-1">Category</span>
          <input 
            type="text" 
            name="category"
            className="form-input"
            title="Enter category tags separated with commas ','"
          />
        </label>

        <div className="mt-4 mx-1 flex items-center justify-between">
          <button onClick={onClose} type="button" className="close-btn">Close</button>
          <button type="submit" className="submit-btn">Add</button>
        </div>
        
      </form>
    </div>
  )
}

export default BookmarkForm