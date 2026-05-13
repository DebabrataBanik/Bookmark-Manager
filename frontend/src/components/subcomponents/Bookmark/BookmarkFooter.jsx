import { CalendarIcon, Clock4Icon, EyeIcon } from "lucide-react"

const BookmarkFooter = ({children, item, lastVisited, dateAdded}) => {
  return (
    <div className="article-footer">
      <div className="flex items-center gap-5">
        <span title="View count" className="stat">
          <EyeIcon size={12} />
          {item.count}
        </span>
        <span title="Last visited" className="stat">
          <Clock4Icon size={12} />
          {lastVisited || '--'}
        </span>
        <span title="Date Added" className="stat">
          <CalendarIcon size={12} />
          {dateAdded}
        </span>
      </div>
      {children}
    </div>
  )
}

export default BookmarkFooter