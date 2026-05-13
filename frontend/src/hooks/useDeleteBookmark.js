import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBookmark } from "../services/bookmarkService";

export function useDeleteBookmark(handleClose, setMessage) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteBookmark,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks']})
      queryClient.invalidateQueries({ queryKey: ['archives']})
      queryClient.invalidateQueries({ queryKey: ['pinned']})
      handleClose()
      setMessage({ text: data.message, type: 'success' })
    },
    onError: (error) => {
      setMessage({ text: error.message, type: 'error'})
    }
  })

  return deleteMutation
}