import React,{useState} from 'react'
import { Popup, displayPopup } from "../components/Alerts";
import {resetPassword} from '../API'

 const ResetPassword = (props) =>{

 const [changePass, setChangePass] = useState({ci:'', email:''});
 const [popup, setPopup] = useState({});

  const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  const validateFields = (name,value) =>{
    console.log(name,value)
    

    if (name === 'ci'){
      if(!Number(value) || !Number.isInteger(Number(value)) || Number(value) < 0) return false
    }

    return true
  }

  const onChangeField = (e) =>{

    const { name, value } = e.target;
    if(value !== ''){
      if(!validateFields(name,value)) return
    }

    setChangePass({...changePass,[name]:value})
  }

 const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(changePass)

    if(!changePass.ci || !changePass.email){
      setPopup({ text: 'Rellene todo los campos!', type: "error" });
      displayPopup("error", ".ResetPassword");
      return
    }

    if (!emailValidator.test(changePass.email)){
      setPopup({ text: 'Email invalido', type: "error" });
      displayPopup("error", ".ResetPassword");
      return
    } 
    

    const res = await resetPassword(changePass)
    if (res.status === 200) {
       alert("Cambio de contraseña satisfactorio!")
       props.history.push("/")
    }
     if (res.status >= 400){
      setPopup({ text: res.data, type: "error" });
      displayPopup("error", ".ResetPassword");
    }
     if (res.status >= 500){
      setPopup({ text: 'Error al conectar con el servidor', type: "error" });
      displayPopup("error", ".ResetPassword");
    }
  };

	return (
    <React.Fragment>
    <Popup popup={popup} zone={"ResetPassword"} />
        <form
          onSubmit={handleSubmit}
          className="form-reset-password"
          style={{ width: "95%", display:props.visible ? 'flex' : 'none', flexDirection: "column", overflow:'auto' }}
        >
        <h2 style={{textAlign:'center'}}>Recuperacion de contraseña</h2>
          <div className="form-input">
            <label id="label-ci" style={{ marginBottom: "10px" }}>
             Introduzca su Cedula
            </label>
            <input
              type="text"
              id="ci-send"
              name="ci"
              autoComplete="off"
              onChange={(e) => {
                onChangeField(e);
              }}
              value={changePass.ci ? changePass.ci : ''}
              required
            />
          </div>

            <div className="form-input">
            <label id="label-email" style={{ marginBottom: "10px" }}>
             Introduzca su Email
            </label>
            <input
              type="email"
              id="email-send"
              name="email"
              autoComplete="off"
              onChange={(e) => {
                onChangeField(e);
              }}
              value={changePass.email ? changePass.email : ''}
              required
            />
          </div>

      
          <div style={{width:'100%',display:'flex',flexFlow:'wrap'}}>
           <button style={{marginTop:"10px", width:"180px"}}
            type="button"
            className="btn btn-login"
            onClick={(e)=>{props.changeVisibility()}}
            >
              Regresar al inicio
            </button>
          
          <button
            style={{ marginTop: "10px" , width:'180px'}}
            type="submit"
            className="btn btn-login"
          >
            {" "}
            Recuperar contraseñar{" "}
          </button>

           
          </div>
        </form>
    </React.Fragment>
  );

}

export default ResetPassword
