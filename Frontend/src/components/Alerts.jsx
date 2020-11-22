import React, {useState, useEffect} from 'react'

export const displayPopup = (status) => {
  const displayPopup = document.querySelector('.popup')
  displayPopup.style.transform = 'translateY(-110%)'

  setTimeout(() => {
    displayPopup.style.transform = 'translateY(0%)'
  }, 500)
  
  if(status === 'received'){
  setTimeout(()=>{
    displayPopup.style.transform = 'translateY(-110%)'
  },6000)    
}

 if(status === 'hidden'){
   displayPopup.style.transform = 'translateY(-110%)'
 }
}

export const displayAlert = (value) =>{
   const alert = document.querySelector('.alert')
  if(value === true){
    alert.style.visibility = 'visible'
  alert.style.opacity = '1'
  alert.style.zIndex = '10000'
  }else{
    alert.style.visibility = 'collapse'
      alert.style.opacity = '0'
    alert.style.zIndex = '-100'
  }

}

export const Popup = (props) => {
  const [popupText, setPopupText] = useState("")
  const [type, setType] = useState("")
  useEffect(() => {
    setPopupText(props.popup.text)
    setType(props.popup.type)
  }, [props]);

  return (
    <div className={`popup ${type ? type : ''}`}>
      <p>{popupText ? popupText : ''}</p>
    </div>
  )

}

export const Alert = (props) => {
  const [alerts, setAlerts] = useState("")
  useEffect(()=>{
    setAlerts(props.alert)
  },[props])

  return (
    <div className="alert">
      <div>
        <p style={{textAlign:'center'}}>{alerts ? alerts : ''}  </p>
        <div className="buttons-container"><button className="btn btn-cancel" onClick={(e)=>{displayAlert(false)}}>Cancelar</button> <button className="btn btn-confirm" onClick={(e)=>{props.actions(props.confirm)}}>Continuar</button></div>
      </div>
    </div>
  )

}




