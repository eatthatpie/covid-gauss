export function getWindowHeight() {
    return (
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
    )
}

export function getWindowWidth() {
    return (
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
    )
}

export function formatDate(date) {
  const dateObj = new Date(date)
  const y = dateObj.getFullYear()
  const m = dateObj.getMonth() + 1
  const d = dateObj.getDate()

  return `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`
}
