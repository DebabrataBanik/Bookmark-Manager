import { Bookmark, MenuIcon, PlusIcon, Search, SearchIcon } from 'lucide-react'
import { ThemeContext } from '../context/ThemeContext'
import { useContext } from 'react'

const Header = ({ onOpen, onSearchChange, searchInput, setShowSidebar, showSidebar }) => {

  const { toggleTheme } = useContext(ThemeContext)

  return (
    <header>
      <a href="/" aria-label='Go to homepage'>
        <div className='hidden lg:flex items-center gap-2 font-bold'>
          <span className='inline-block p-1 bg-accent rounded-sm'>
            <Bookmark size={15} className='text-bg-primary' />
          </span>
          Bookmark Manager
        </div>
      </a>

      <div className='flex gap-4 w-full lg:w-fit'>
        
        <button 
          aria-label='Toggle sidebar'
          aria-expanded={showSidebar}
          onClick={() => setShowSidebar(prev => !prev)} type='button' 
          className='flex items-center justify-center border-2 border-border-subtle p-2 px-2.5 rounded-md lg:hidden'
        >
          <MenuIcon size={18} />
        </button>
        <label className='relative flex items-center mr-auto w-96'>
          <SearchIcon className='search-icon' aria-hidden='true' size={15} />
          <input 
            type="search"
            name='search'
            placeholder='Search by title...'
            className='search-input w-full h-full'
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
        <button 
          aria-label='Add Bookmark'
          onClick={() => onOpen(null)} 
          className='add-btn px-2.5' 
          type='button'
        > 
          <PlusIcon aria-hidden='true' size={18} /> 
          <span className='hidden md:block'>
            Add Bookmark
          </span>
        </button>
        <button 
          onClick={toggleTheme}  
          type='button' 
          className='user-btn shrink-0'
        >
          <img
            width={40}
            height={40}
            src="/user_profiles/user.avif" 
            alt="user headshot" 
          />
        </button>
      </div>
    </header>
  )
}

export default Header