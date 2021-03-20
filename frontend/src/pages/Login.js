import React, { useState } from "react";
import eye from "../static/icons/eye.svg";
import eyeClose from "../static/icons/eyeClose.svg";
const Login = (props) => {
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);

  const hiddenPass = () => {
    if (show === true) {
      setShow(false);
    } else {
      setShow(true);
    }
    console.log(show);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user.password);
    if(user.password === "12345"){
 
        props.history.push('/home')
    }
  };

  return (
    <React.Fragment>
      <div className="container-login">
        <h2 style={{ textAlign: "center" , marginBottom:'40px', marginTop:'0px'}}>
          Unidad Educativa Colegio Juan Bosco
        </h2>

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
              id="ci"
              name="ci"
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
            style={{ marginTop: "50px" }}
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
