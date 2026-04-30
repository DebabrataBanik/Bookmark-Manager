import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState, useEffect } from "react"
import validator from 'validator'
import { addBookmark, updateBookmark } from "../services/bookmarkService"

const BookmarkForm = ({ onClose, bookmarkData }) => {
  const [formData, setFormData] = useState(() => {
    return {
      url: bookmarkData?.url || '',
      title: bookmarkData?.title || '',
      description: bookmarkData?.description || '',
      category: bookmarkData?.category?.join(',') || ''
    }
  })
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if(!message) return

    const timer = setTimeout(() => {
      setMessage(null)
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [message, onClose])

  const queryClient = useQueryClient()

  function handleSuccessState(data){
    queryClient.invalidateQueries({ queryKey: ['bookmarks']})
    queryClient.invalidateQueries({ queryKey: ['categories']})
    setMessage(data.message)
    setFormData({
      url: '',
      title: '',
      description: '',
      category: ''
    })
  }

  const addMutation = useMutation({
    mutationFn: addBookmark,
    onSuccess: (data) => handleSuccessState(data),
    onError: (error) => {
      setError({ message: error.message })
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateBookmark,
    onSuccess: (data) => handleSuccessState(data),
    onError: (error) => {
      setError({ message: error.message })
    }
  })

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
    
    const validData = {
      ...data,
      url
    }

    setError(null)
    
    if(bookmarkData){
      updateMutation.mutate({
        id: bookmarkData._id,
        data: validData
      })
    } else {
      addMutation.mutate(validData)
    }
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
  
  const disabledState = addMutation.isPending || updateMutation.isPending
  const btnText = disabledState
  ? (bookmarkData ? 'Updating...' : 'Adding...')
  : (bookmarkData ? 'Update' : 'Add')


  return (
    <div className="form-wrapper px-5 sm:p-8">
      <form onSubmit={handleSubmit} className="bookmark-form gap-1 sm:gap-4">
        <h1 className="text-lg sm:text-xl font-bold mb-2 mx-2 text-center sm:text-left">Add Bookmark</h1>
        <div className="h-5 text-center">
          {
            error?.message && <span className="text-sm text-center text-error">{error.message}</span>
          }
          {
            message && <span className="text-sm text-center text-success">{message}</span>
          }
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <label className="w-full sm:w-1/2 form-label">
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

          <label className="w-full sm:w-1/2 form-label">
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
            disabled={disabledState} 
            onClick={onClose} 
            type="button" 
            className="btn close-btn"
          >
            Close
          </button>
          
          <button 
            type="submit" 
            className="btn submit-btn"
            disabled={disabledState}
          >
            {btnText}
          </button>
        </div>
        
      </form>
    </div>
  )
}

export default BookmarkForm