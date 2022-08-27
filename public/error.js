const error = document.querySelector('.error')
const success = document.querySelector('.success')
const nameInput = document.querySelector('.name')
if (nameInput?.value == '') {
    setTimeout(() => {
        error.classList.add('hide')
        success.classList.add('hide')
        if (success.innerHTML == 'Sign up successfull' || success.innerHTML.includes('You already exist')) {
            window.location.href = '/weekly-schedule'
        }

    }, 2500)
}

setTimeout(() => {
    if (success.innerHTML.includes('you have succesfully scheduled your days.')) {
        window.location.href = '/weekly-schedule'
    }
}, [2500])

setTimeout(() => {
    if (error.innerHTML.includes('schedule your days!')) {
        error.classList.add('hide')
    }
}, [2500])