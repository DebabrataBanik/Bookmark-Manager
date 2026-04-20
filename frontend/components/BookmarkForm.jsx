import { useEffect, useRef, useState } from "react"
import validator from 'validator'

const BookmarkForm = ({ onClose }) => {
  const wrapperRef = useRef(null)

  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    category: ''
  })
  const [error, setError] = useState({})

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

    const data = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value.trim()])
    )

    const error = {}

    const url = data.url.startsWith('http') ? data.url : `https://${data.url}`
    const isValidUrl = validator.isURL(url)

    if(!isValidUrl){
      error.url = 'Enter valid url'
    }

    if (data.title.length < 3 || data.title.length > 80) {
      error.title = 'Title must be 3–80 characters.'
    }
    
    if(Object.keys(error).length > 0){
      setError(error)
      return 
    }
    
    const validData = {
      ...data,
      url
    }

    console.log(validData)
  }

  function handleChange(e){
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))

    setError(prev => ({
      ...prev,
      [name]: ''
    }))
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
              className="form-input my-1"
              placeholder="https://example.com"
              title="Enter a valid URL starting with http:// or https://"
              value={formData.url}
              onChange={handleChange}
            /> 
            {
              error?.url && <span className="ml-1 text-xs text-error">{error.url}</span>
            }
          </label>

          <label className="w-1/2 form-label">
            <span className="ml-1">Title</span>
            <input 
              type="text" 
              name="title"
              className="form-input my-1"
              placeholder="e.g. React Docs, CSS Tricks Guide"
              title="Enter a short, clear title (3–80 characters)."
              value={formData.title}
              onChange={handleChange}
              />
            {
              error?.title && <span className="ml-1 text-xs text-error">{error.title}</span>
            }
          </label>
        </div>

        <label className="form-label">
          <span className="ml-1">Description</span>
          <textarea 
            name="description"
            className="form-input my-1"
            title="Enter a well described summary for your bookmark."
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <label className="form-label">
          <span className="ml-1">Category</span>
          <input 
            type="text" 
            name="category"
            className="form-input my-1"
            title="Enter category tags separated with commas ','"
            value={formData.category}
            onChange={handleChange}
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