import React, {useState} from "react";
import {useNavigate} from 'react-router-dom'
import ReCAPTCHA from "react-google-recaptcha";
import eye from "../static/icons/eye.svg";
import eyeClose from "../static/icons/eyeClose.svg";
import boscoImg from "../static/logos/jb.jpg";
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
  const [show, setShow] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [popup, setPopup] = useState({});

  const hiddenPass = () => {
    if (show === true) {
      setShow(false);
    } else {
      setShow(true);
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
    }
  };

  return (
    <React.Fragment>
      <Popup popup={popup} zone={"Login"} />

      <div className="container-login">
        <img src={boscoImg} alt="bosco" />
        <form onSubmit={handleSubmit} className="form-login" style={{display:resetPassword ? 'none' : 'flex'}}>

          <div className="form-input">
            <label id="label-ci" style={{ marginBottom: "10px" }}>
              Cedula o Correo Electronico
            </label>
            <input
              type="text"
              id="user"
              name="user"
              autoComplete="off"
              onChange={(e) => {
                setUser({ ...user, user: e.target.value });
              }}
              required
            />
          </div>

          <div className="form-input">
            <label id="label-password">Contraseña</label>
            <div>
              <input
                type={show === true ? "text" : "password"}
                id="password"
                name="password"
                autoComplete="off"
                style={{ width: "100%" }}
                onChange={(e) => {
                  setUser({ ...user, password: e.target.value });
                }}
                required
              />

              <img
                src={show === true ? eye : eyeClose}
                alt="eye"
                style={{ cursor: "pointer" }}
                onClick={(e) => hiddenPass()}
              />
            </div>
          </div>
          <div className="container-captcha">
           
          </div>
           <p
              onClick={(e) => {
                showResetPassword();
              }}
              style={{
                color: "#2d2d2d",
                cursor: "pointer",
                width: "fit-content",
                margin:"15px auto"
              }}
            >
              Olvido su contraseña?
            </p>
          <button
            style={{ marginTop: "10px" }}
            type="submit"
            className="btn btn-login"
          >
            {" "}
            Ingresar{" "}
          </button>
        </form>

        <ResetPassword
          visible={resetPassword}
          changeVisibility={showResetPassword}
        />
      </div>
    </React.Fragment>
  );
};

export default Login;
