const CategoriesSkeleton = () => {
  return (
    <div aria-hidden='true' className="select-none pointer-events-none animate-pulse flex flex-col gap-5">
      {
        Array.from({ length: 10 }).map((_,idx) => (
        <label key={idx} className="checkbox-label">
          <input 
            type="checkbox"
            className="checkbox"
          />
          <span className="h-3 w-1/2 bg-bg-secondary rounded-full"></span>
        </label>
        ))
      }
    </div>
  )
}

export default CategoriesSkeleton