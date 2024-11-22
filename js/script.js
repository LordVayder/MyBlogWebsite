const modalBg = document.querySelector('.modal_bg')
const body = document.body
let isModalOpen = false

function openModal() {
    if (!isModalOpen) {
        modalBg.style.visibility = 'visible'
        body.style.overflow = 'hidden'
        isModalOpen = true
    }
}

function closeModal() {
    if (isModalOpen) {
        modalBg.style.visibility = 'hidden'
        body.style.overflow = ''
        isModalOpen = false
    }
}

document.addEventListener('click', (el) => {
    const clickedObjectClass = el.target.className
    if (clickedObjectClass !== 'modal' && clickedObjectClass === 'modal_bg') {
        closeModal()
    }
})
