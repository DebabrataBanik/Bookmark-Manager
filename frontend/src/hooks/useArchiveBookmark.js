import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setArchive } from "../services/bookmarkService";

export function useArchiveBookmark(handleClose, setMessage) {
  const queryClient = useQueryClient()

  const archiveMutation = useMutation({
    mutationFn: ({id, state}) => setArchive(id, state),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks']})
      queryClient.invalidateQueries({ queryKey: ['archives']})
      queryClient.invalidateQueries({ queryKey: ['categories']})
      queryClient.invalidateQueries({ queryKey: ['pinned']})
    },
    onError: (error) => {
      setMessage({ text: error.message, type: 'error' })
    }
  })

  return archiveMutation
}