import { ArchiveIcon, HomeIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { nanoid } from 'nanoid'

const Sidebar = () => {

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
  }, [])


  return (
    <aside>
      <button className="flex items-center gap-2 py-1.5 px-2 text-sm bg-accent-subtle text-accent rounded-md font-bold mb-1 w-full">
        <HomeIcon size={15} />
        Home
      </button>
      <button className="flex items-center gap-2 py-1.5 px-2 text-sm rounded-md w-full">
        <ArchiveIcon size={15} />
        Archived
      </button>

      <div className="mt-5 px-2">
        <h3 className="text-xs font-medium">TAGS</h3>
        <form className="flex flex-col gap-4 mt-2">
          {
            categories.length > 0 ? (
              categories.map(tag => {
                return (
                  <label key={nanoid()} className="checkbox-label">
                    <input 
                      type="checkbox"
                      className="checkbox"
                    />
                    {tag}
                  </label>
                )
              })
            )
            :
            'Getting categories'
          }
        </form>
      </div>
    </aside>
  )
}

export default Sidebar