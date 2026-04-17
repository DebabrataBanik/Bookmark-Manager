import { ArchiveIcon, HomeIcon } from "lucide-react"

const Sidebar = () => {
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
      </div>
    </aside>
  )
}

export default Sidebar