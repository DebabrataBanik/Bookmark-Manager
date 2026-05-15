import { Bookmark, MenuIcon, MoonIcon, PlusIcon, Search, SearchIcon, SunIcon, UserIcon } from 'lucide-react'
import { ThemeContext } from '../context/ThemeContext'
import { useContext, useState, useEffect, useRef } from 'react'

const Header = ({ onOpen, onSearchChange, searchInput, setShowSidebar, showSidebar }) => {

  const { toggleTheme, isDarkMode } = useContext(ThemeContext)
  const [showDropdown, setShowDropdown] = useState(false)

  const dropdownRef = useRef(null)
  const searchRef = useRef(null)
  
  useEffect(() => {
    function handleOutsideClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])

  useEffect(() => {
    function focusInput(e){
      if(searchRef.current && e.key === '/'){
        e.preventDefault()
        searchRef.current.focus()
      }
    }
    document.addEventListener('keydown', focusInput)
    return () => document.removeEventListener('keydown', focusInput)
  }, [])

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
            ref={searchRef}
            type="search"
            name='search'
            placeholder='Search by title...'
            className='search-input w-full h-full'
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className='absolute right-2 border border-border rounded-sm px-2 bg-bg-primary text-text-tertiary'>/</span>
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
          ref={dropdownRef}
          onClick={() => setShowDropdown(prev => !prev)}  
          type='button' 
          className='user-btn shrink-0'
        >
          <UserIcon size={20} />
        </button>
        {
          showDropdown && (
            <div onClick={e => e.stopPropagation()} className='user-dropdown flex flex-col gap-2'>
              <span className='flex items-center gap-2 border-b border-b-border pb-2'>
                <UserIcon size={15}/> Guest
              </span>
                <button className='flex items-center gap-2'
                  onClick={toggleTheme}
                >
                  {
                    isDarkMode ? 
                    <MoonIcon size={15} />
                    :
                    <SunIcon size={15} />
                  }
                  Theme 
                </button>
            </div>
          )
        }
      </div>
    </header>
  )
}

export default Header