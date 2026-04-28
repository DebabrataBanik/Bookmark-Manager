import { useState, useEffect } from "react"
import validator from 'validator'

const BookmarkForm = ({ onClose, onBookmarkAdd, bookmarkData, onBookmarkUpdate }) => {
  const [formData, setFormData] = useState(() => {
    return {
      url: bookmarkData?.url || '',
      title: bookmarkData?.title || '',
      description: bookmarkData?.description || '',
      category: bookmarkData?.category?.join(',') || ''
    }
  })
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if(!message) return

    const timer = setTimeout(() => {
      setMessage(null)
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [message, onClose])

  async function addBookmark(data){
    try {
      setError(null)
      const res = await fetch('http://localhost:8000/api/bookmark/add', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if(!res.ok){
        const err = await res.json()
        setError(err)
        return
      }
      const result = await res.json()
      setMessage(result.message)
      setFormData({ url: '',
        title: '',
        description: '',
        category: ''
      })
      onBookmarkAdd(result.data)

    } catch (error) {
      console.error(error)
      setError({ message: error.message })
    } finally{
      setIsSubmitting(false)
    }
  }

  async function updateBookmark(data){
    try {
      setError(null)
      const res = await fetch(`http://localhost:8000/api/bookmark/${bookmarkData._id}`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      if(!res.ok){
        const err = await res.json()
        setError(err)
        return
      }
      const result = await res.json()
      setMessage(result.message)
      setFormData({ url: '',
        title: '',
        description: '',
        category: ''
      })
      onBookmarkUpdate(result.data)

    } catch (error) {
      console.error(error)
      setError({ message: error.message })
    } finally{
      setIsSubmitting(false)
    }
  }

  async function handleSubmit(e){
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

    setIsSubmitting(true)
    
    const validData = {
      ...data,
      url
    }
    
    if(bookmarkData){
      await updateBookmark(validData)
      return
    }
    await addBookmark(validData)
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

  const btnText = isSubmitting
  ? (bookmarkData ? 'Updating...' : 'Adding...')
  : (bookmarkData ? 'Update' : 'Add')

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="bookmark-form">
        <h1 className="text-xl font-bold mb-2 mx-2">Add Bookmark</h1>
        <div className="h-5 text-center">
          {
            error?.message && <span className="text-sm text-center text-error">{error.message}</span>
          }
          {
            message && <span className="text-sm text-center text-success">{message}</span>
          }
        </div>
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
            <span className="h-4 ml-1 text-xs text-error">
              {
                error?.url && error.url
              }
            </span>
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
            <span className="h-4 ml-1 text-xs text-error">
              {
                error?.title && error.title
              }
            </span>
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
          <button 
            disabled={isSubmitting} 
            onClick={onClose} 
            type="button" 
            className="btn close-btn"
          >
            Close
          </button>
          
          <button 
            type="submit" 
            className="btn submit-btn"
            disabled={isSubmitting}
          >
            {btnText}
          </button>
        </div>
        
      </form>
    </div>
  )
}

export default BookmarkForm