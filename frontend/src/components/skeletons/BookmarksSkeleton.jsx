const BookmarksSkeleton = () => {
  return (
    Array.from({length: 5}).map((_,idx) => (
      <article className="animate-pulse h-75" aria-hidden='true' key={idx}>
        <div className="flex items-center gap-4 p-4">
          <div className="shrink-0 w-12.5 h-12.5 rounded-md border border-border"></div>
          <div className="w-full">
            <h2 className="mb-4 h-4 w-1/2 rounded-full bg-bg-secondary"></h2>
            <p className="h-2 w-1/3 bg-bg-secondary rounded-full"></p>
          </div>
          <div className="shrink-0 w-8 h-8 border border-border self-start rounded-md"></div>
        </div>
        <div className="px-4 text-sm">
          <p className="pt-4 border-t flex flex-col gap-2 border-t-border line-clamp-4">
            <span className="block w-full h-2 bg-bg-secondary rounded-full"></span>
            <span className="block w-full h-2 bg-bg-secondary rounded-full"></span>
            <span className="block w-1/2 h-2 bg-bg-secondary rounded-full"></span>
          </p>
          <div className="py-4 flex items-center mt-auto gap-2">
            {
              Array.from({length: 3}).map((_,idx) => <span key={idx} className="w-10 h-4 bg-bg-secondary rounded-sm"></span>)
            }
          </div>
        </div>
        <div className="flex justify-between mt-auto border-t border-t-border p-3 px-5">
          <div className="flex items-center gap-5">
            <span className="h-3 w-6 bg-bg-secondary rounded-full"></span>
            <span className="h-3 w-6 bg-bg-secondary rounded-full"></span>
            <span className="h-3 w-6 bg-bg-secondary rounded-full"></span>
          </div>
          <div className="w-4 h-4 bg-bg-secondary rounded-sm"></div>
        </div>
      </article>
    ))
  )
}

export default BookmarksSkeleton