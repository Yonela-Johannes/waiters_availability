export const Waiter = () => {
    let username = ''
    const setName = (name) => username = typeof name == 'string' ? name == '' ? 'enter name!'
        : (name.trim().replace(/[^a-z, ^A-Z]/g, ''))
        : 'name should be alphabets only!'
    const getName = () => username.slice(0, 1).toUpperCase() + username.slice(1,).toLowerCase()
    return {
        setName,
        getName,
    }
}
