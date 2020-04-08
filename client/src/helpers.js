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
