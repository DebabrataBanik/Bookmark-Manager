import { ArchiveIcon, HomeIcon } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getCategories } from "../services/categoryService"

const Sidebar = ({ selectedTags, onTagSelect, contentPage, onArchiveClick, onHomeClick, showSidebar }) => {  

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  function handleChange(e){
    const { value, checked } = e.target
    onTagSelect(value, checked)
  }

  return (
    <aside className={`fixed h-full lg:h-auto z-10 transition-transform duration-300 ${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
      <button 
        onClick={onHomeClick}
        className={`flex items-center gap-2 py-1.5 px-2 text-sm rounded-md mb-1 w-full ${contentPage === 'home' ? 'bg-accent-subtle text-accent font-semibold' : ''}`}
      >
        <HomeIcon size={15} />
        Home
      </button>
      <button 
        onClick={onArchiveClick}
        className={`flex items-center gap-2 py-1.5 px-2 text-sm rounded-md w-full ${contentPage === 'archive' ? 'bg-accent-subtle text-accent font-semibold' : ''}`}
      >
        <ArchiveIcon size={15} />
        Archived
      </button>

      <div className="mt-5 px-2">
        <h3 className="text-xs font-medium">TAGS</h3>
        <form className="flex flex-col gap-4 mt-2">
          {
            isLoading ? 
            <p className="text-xs">Categories loading skeleton</p>
            :
            categories.length > 0 && (
              categories.map(cat => {
                return (
                  <label key={cat.name} className="checkbox-label">
                    <input 
                      type="checkbox"
                      className="checkbox"
                      value={cat.name}
                      checked={selectedTags.includes(cat.name)}
                      onChange={handleChange}
                    />
                    {cat.name}
                    <span className="count">{cat.count}</span>
                  </label>
                )
              })
            )
          }
        </form>
      </div>
    </aside>
  )
}

export default Sidebar