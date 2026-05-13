import Logo from "../Logo"
import { EllipsisVerticalIcon } from "lucide-react"

const BookmarkHeader = ({children, item, openId, optionsRef, handleToggle}) => {
  return (
    <div className="flex items-center gap-4 p-4">
      <Logo domain={item.domain} />
      <div className="min-w-0">
        <h2 className="font-bold text-lg line-clamp-2">{item.title}</h2>
        <span className="text-xs text-text-secondary font-mono">{item.domain}</span>
      </div>
      <button
        aria-label="Show options"
        aria-expanded={openId}
        ref={openId === item._id ? optionsRef : null}
        onClick={() => handleToggle(item._id)} type="button" className="modify-btn"
      >
        <EllipsisVerticalIcon size={20} />
      </button>
      {
        openId === item._id && (
          <div className='options'>
            {children}
          </div>
        )
      }

    </div>
  )
}

export default BookmarkHeader