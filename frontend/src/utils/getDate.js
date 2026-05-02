export function getDate(dateStr){
  if(!dateStr) return null
  const date = new Date(dateStr)
  const createdDate = date.getDate()
  const createdMonth = date.toLocaleString('default', { month: 'short'})
  return `${createdDate} ${createdMonth}`
}