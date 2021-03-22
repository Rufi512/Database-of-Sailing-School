import React, { useState } from "react";
import eye from "../static/icons/eye.svg";
import eyeClose from "../static/icons/eyeClose.svg";
import boscoImg from '../static/logos/jb.jpg';
import CarrouselImages from '../components/CarrouselImages'
import Cookies from 'js-cookie'
import { Popup, displayPopup } from "../components/Alerts";
import {loginUser} from '../API'

const Login = (props) => {
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);
  const [popup, setPopup] = useState({});


  const hiddenPass = () => {
    if (show === true) {
      setShow(false);
    } else {
      setShow(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(user)
    if (res.status === 200) {
       Cookies.set('token', res.data.token);
       Cookies.set('rol', res.data.rol);
       window.location.href = '/home'
    }
     if (res.status >= 400){
      setPopup({ text: res.data, type: "error" });
      displayPopup("error", ".Login");
    }
     if (res.status >= 500){
      setPopup({ text: 'Error al conectar con el servidor', type: "error" });
      displayPopup("error", ".Login");
    }
  };

  return (
    <React.Fragment>
    <Popup popup={popup} zone={"Login"} />

    <div className="carrousel-imgs">
          <CarrouselImages/>
    </div>
    
      <div className="container-login">
      <img src={boscoImg} alt="bosco"/>
        <form
          onSubmit={handleSubmit}
          style={{ width: "95%", display: "flex", flexDirection: "column" }}
        >
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
          <p
          onClick={(e)=>{alert('Estoy de adorno :p')}}
            style={{
              textAlign: "end",
              color: "#2d2d2d",
              cursor: "pointer",
              margin: "0",
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
      </div>
    </React.Fragment>
  );
};

export default Login;
