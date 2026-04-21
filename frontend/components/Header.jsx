import { Bookmark, PlusIcon, Search, SearchIcon } from 'lucide-react'

const Header = ({ onOpen, onSearchChange, searchInput }) => {
  return (
    <header >
      <a href="/">
        <div className='flex items-center gap-2 font-bold'>
          <span className='inline-block p-1 bg-accent rounded-sm'>
            <Bookmark size={15} className='text-bg-primary' />
          </span>
          Bookmark Manager
        </div>
      </a>

      <div className='flex gap-2'>
        <label className='relative flex items-center'>
          <SearchIcon className='search-icon' aria-hidden='true' size={15} />
          <input 
            type="search"
            name='search'
            placeholder='Search by title...'
            className='search-input'
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>
        <button onClick={onOpen} className='add-btn' type='button'> 
          <PlusIcon aria-hidden='true' size={15} /> Add Bookmark
        </button>
        <button type='button' className='user-btn'>
          US
        </button>
      </div>
    </header>
  )
}

export default Header