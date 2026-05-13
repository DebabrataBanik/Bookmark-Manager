import { useState } from "react"

export function useDeleteDialog(setOpenDeleteDialog){
  const [deleteId, setDeleteId] = useState(null)

  function handleOpenDeleteDialog(id){
    setOpenDeleteDialog(true)
    setDeleteId(id)
  }

  function handleClose(){
    setOpenDeleteDialog(false)
    setDeleteId(null)
  }

  return { deleteId, handleOpenDeleteDialog, handleClose }
}