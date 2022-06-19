import React, {useState} from "react";
import {Link,useNavigate} from 'react-router-dom'
import ReCAPTCHA from "react-google-recaptcha";
import boscoImg from "../static/logos/jb.jpg";
import {ReactComponent as PersonIcon} from "../static/icons/person.svg";
import {ReactComponent as EyeIcon} from "../static/icons/eye.svg";
import {ReactComponent as EyeClose} from "../static/icons/eye.svg";
import {ReactComponent as LockIcon} from "../static/icons/lock.svg";
//import CCImg from "../static/icons/cc-logo.svg";
/* <ReCAPTCHA
              sitekey="6Lf0i_seAAAAADa-22kcxr_u8f2AXw3zIP_vf-aa"
              onChange={onCaptcha}
            />*/
import Cookies from "js-cookie";
import { Popup, displayPopup } from "../components/Alerts";
import { loginUser } from "../API";
import ResetPassword from "../components/ResetPassword";
import "../static/styles/form-login.css";
const Login = (props) => {
  let navigate = useNavigate()
  const [user, setUser] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [popup, setPopup] = useState({});

  const hiddenPass = () => {
    if (showPass === true) {
      setShowPass(false);
    } else {
      setShowPass(true);
    }
  };

  const onCaptcha = async (value) => {
    if (value) {
      console.log("No es el xocas");
      setUser({...user,recaptcha:value})
    }else{
      setUser({...user,recaptcha:''})
    }
  };

  const showResetPassword = () => {
    if (resetPassword) {
      setResetPassword(false);
      return;
    }
    setResetPassword(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user)
    /*
    const res = await loginUser(user);
    if (res.status === 200) {
    console.log(res)
      Cookies.set("token", res.data.token);
      Cookies.set("rol", res.data.rol);
      navigate("/home");
    }
    if (res.status >= 400) {
      setPopup({ text: res.data, type: "error" });
      displayPopup("error", ".Login");
    }
    if (res.status >= 500) {
      setPopup({ text: "Error al conectar con el servidor", type: "error" });
      displayPopup("error", ".Login");
    }*/
  };


  return (
    <React.Fragment>
      <div className="container-login">
        <h1>Unidad Educativa Colegio Juan Bosco</h1>
        <img src={boscoImg} alt="juan-bosco"></img>
        <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <p>Cedula o Correo electronico</p>
              <div className="field-content">
              <div className="icon">
                <PersonIcon fill={"#19429f"}/>
              </div>
              <input type="text" placeholder="Introduce tu cedula o correo" onInput={(e)=>{setUser({...user,user:e.target.value})}}/>
              </div>
            </label>
            <label className="field">
            <p>Contraseña</p>
            <div className="field-content">
              <div className="icon">
                <LockIcon fill={"#19429f"}/>
              </div>
              <input type={showPass ? "text" : "password"} placeholder="Introduzca su contraseña" onInput={(e)=>{setUser({...user,password:e.target.value})}}/>
              <div className="button" onClick={(e)=>{hiddenPass()}}>
                {
                showPass ? <EyeClose fill={"#19429f"}/> : <EyeIcon fill={"#19429f"}/>
              }
              </div>
              </div>
            </label>
            <Link to="/forgot-password" className="forgot">Olvidaste tu contraseña?</Link>
            <button type="submit" className="button-submit">Ingresar</button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default Login;
