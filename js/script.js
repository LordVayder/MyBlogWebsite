const modalBg = document.querySelector('.modal_bg')
const modal = document.querySelector('.modal')
const br = document.createElement('br')
const body = document.body
let isModalOpen = false

function createTag(Tag, Id, Class, Type, Placeholder, Name, Required) {
    const tagName = document.createElement(Tag)
    if (Id) tagName.id = Id
    if (Class) tagName.className = Class
    if (Type) tagName.type = Type
    if (Placeholder) tagName.placeholder = Placeholder
    if (Name) tagName.name = Name
    if (Required && Tag === 'input' || Tag === 'textarea') tagName.required = Required
    return tagName
}

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
    console.log(el.target.className)
    const clickedObjectClass = el.target.className
    if (clickedObjectClass !== 'modal' && clickedObjectClass === 'modal_bg') {
        closeModal()
    }
})
