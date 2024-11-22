const modalBg = document.querySelector('.modal_bg')
const loginForm = document.querySelector('.login_form')
const registrationForm = document.querySelector('.reg_form')
const body = document.body
const regUsername = document.querySelector('.reg_username').value
const regEmail = document.querySelector('.reg_email').value
const regPassword = document.querySelector('.reg_password').value
let isModalOpen = false

function openModal(event) {
    const clickedBtnClass = event.target.className
    modalBg.style.visibility = 'visible'
    body.style.overflow = 'hidden'

    if (clickedBtnClass === 'login_btn') {
        loginForm.style.display = 'block'
    }
    else if (clickedBtnClass === 'registration_btn') {
        registrationForm.style.display = 'block'
    }
    isModalOpen = true
}

function closeModal() {
    if (isModalOpen) {     
        modalBg.style.visibility = 'hidden'
        body.style.overflow = ''
        isModalOpen = false
        loginForm.style.display = 'none'
        registrationForm.style.display = 'none'
    }
}

document.addEventListener('click', (el) => {
    const clickedObjectClass = el.target.className
    if (clickedObjectClass !== 'modal' && clickedObjectClass === 'modal_bg') {
        closeModal()
    }
})

registrationForm.addEventListener('submit', (event) => {
    event.preventDefault()

    fetch('/register', {
        method: 'POST',
        headers: {'Content-type': 'application-json'},
        body: JSON.stringify({regUsername, regEmail, regPassword})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Регистрация успешна!')
            closeModal()
        } else {
            alert('Ошибка регистрации: ', data.message)
        }
    })
    .catch(err => console.error('Ошибка: ', err))
})