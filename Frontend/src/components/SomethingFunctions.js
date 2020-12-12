
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

//Muestra historial del estudiante
export const viewHistory = (value)=>{
 const container = document.querySelector('.view-information')
  const containerHistory = document.querySelector('.view-history')
  if (value === true) {
    container.style.display = "none"
    containerHistory.style.display = 'flex'
  } else {
    container.style.display = "flex"
    containerHistory.style.display = 'none'
  }

}

//Controla los labels de los inputs

export const checkInputs = (id, value) => {
  const check = document.getElementById('label-'+id)
  if(value === ""){
    check.classList.remove('input-active')
    }else{
    check.classList.add('input-active')
  }

}

//Cambia entre años disponibles (Historial)
export const switchYear = (value) =>{
const container = document.querySelectorAll('.container-history')
  if(value === 0){
    container.forEach(el=>{
         el.style.transform = 'translateX(0%)'
    })
  }else{
    container.forEach(el=>{
      el.style.transform = 'translateX(-'+value+'00%)'
    })
  }

}

export const switchActive = (id)=>{
const container = document.querySelectorAll('.btn-history')
  container.forEach(el=>{
    el.classList.remove('btn-active-history')
  })

  container[id].classList.add('btn-active-history')
}
