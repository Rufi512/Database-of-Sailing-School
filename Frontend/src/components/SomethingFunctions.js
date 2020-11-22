
export const changeEdit = (value) => {
    const container = document.querySelector('.view-information')
    const containerEdit = document.querySelector('.edit-information')
    if (value === true) {
        container.style.display = "none"
        containerEdit.style.display = 'flex'
    } else {
        container.style.display = "flex"
        containerEdit.style.display = 'none'
    }
}

//muestra la pantalla para comentar

export const screenComment = (value) => {
    const container = document.querySelector('.screen-back')
    const container_commit = document.querySelector('.screen-comment')
    if (value === true) {
        container.style.visibility = 'visible'
        container.style.opacity = "100%"
        container_commit.style.visibility = 'visible'
        container_commit.style.opacity = "100%"
    } else {
        const textarea = document.querySelector('.input-comment')
        const container_commit = document.querySelector('.screen-comment')
        container.style.visibility = 'hidden'
        container.style.opacity = "0%"
        container_commit.style.visibility = 'hidden'
        container_commit.style.opacity = "0%"
        textarea.value = ""
    }

}


