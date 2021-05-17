import React,{useState} from 'react'
import { Popup, displayPopup } from "../components/Alerts";
import {resetPassword} from '../API'

 const ResetPassword = (props) =>{

 const [changePass, setChangePass] = useState({});
 const [popup, setPopup] = useState({});

 const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(changePass)

    if(!changePass.ci || !changePass.email || !changePass.password || !changePass.passwordConfirm){
      setPopup({ text: 'Rellene todo los campos!', type: "error" });
      displayPopup("error", ".ResetPassword");
      return
    }

    if(changePass.password !== changePass.passwordConfirm){
      setPopup({ text: 'Las contraseñas no coinciden!', type: "error" });
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
    
      <div className="container-login">
     
        <form
          onSubmit={handleSubmit}
          style={{ width: "95%", display: "flex", flexDirection: "column", overflow:'auto' }}
        >
        <h2 style={{textAlign:'center'}}>Recuperacion de contraseña</h2>
          <div className="form-input">
            <label id="label-ci" style={{ marginBottom: "10px" }}>
             Introduzca su Cedula
            </label>
            <input
              type="text"
              id="ci"
              name="ci"
              autoComplete="off"
              onChange={(e) => {
                setChangePass({ ...changePass, ci: e.target.value });
              }}
              required
            />
          </div>

            <div className="form-input">
            <label id="label-email" style={{ marginBottom: "10px" }}>
             Introduzca su Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="off"
              onChange={(e) => {
                setChangePass({ ...changePass, email: e.target.value });
              }}
              required
            />
          </div>

          <div className="form-input">
            <label id="label-email" style={{ marginBottom: "10px" }}>
             Introduzca su nueva contraseña
            </label>
            <input
              type="text"
              id="password"
              name="password"
              autoComplete="off"
              onChange={(e) => {
                setChangePass({ ...changePass, password: e.target.value });
              }}
              required
            />
          </div>

          <div className="form-input">
            <label id="label-email" style={{ marginBottom: "10px" }}>
             Confirme su nueva contraseña
            </label>
            <input
              type="password"
              id="password-confirm"
              name="password-confirm"
              autoComplete="off"
              onChange={(e) => {
                setChangePass({ ...changePass, passwordConfirm: e.target.value });
              }}
              required
            />
          </div>

      
          <div style={{width:'100%',display:'flex',flexFlow:'wrap'}}>
          
          <button
            style={{ marginTop: "10px" , width:'180px'}}
            type="submit"
            className="btn btn-login"
          >
            {" "}
            Cambiar contraseña{" "}
          </button>

            <button style={{marginTop:"10px", width:"180px"}}
            type="button"
            className="btn btn-login"
            onClick={(e)=>{props.history.push("/")}}
            >
              Regresar al inicio
            </button>
          </div>
        </form>
      </div>
    </React.Fragment>
  );

}

export default ResetPassword
