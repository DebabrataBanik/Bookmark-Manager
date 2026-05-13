const BookmarkDetails = ({ item }) => {
  return (
    <div className="px-4 text-sm">
      <p className="pt-4 text-text-secondary border-t border-t-border line-clamp-4">{item.description}</p>
      <div className="py-4 flex items-center mt-auto gap-2 font-mono">
        {
          item.category.map(tag => <span key={tag} className="tags">{tag}</span>)
        }
      </div>
    </div>
  )
}

export default BookmarkDetails