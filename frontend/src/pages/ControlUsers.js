import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getUsersList, registerUser, updateUser, deleteUser } from "../API";
import { Navbar } from "../components/Navbar";
import { Popup, displayPopup, Alert, displayAlert } from "../components/Alerts";
import { ReactComponent as UserIcon } from "../static/icons/user.svg";
import { ReactComponent as EmailIcon } from "../static/icons/email.svg";
import { ReactComponent as KeyIcon } from "../static/icons/key.svg";
import { ReactComponent as IdIcon } from "../static/icons/id.svg";

const rolUser = Cookies.get("rol");

const ControlUsers = () => {
  const [user, setChangeUser] = useState({});
  const [users, setUsers] = useState([]);
  const [userDelete, setUserDelete] = useState("");
  const [send, setSend] = useState("");
  const [buttonName, setButtonName] = useState("");
  const [alert, setAlert] = useState("");
  const [action, setAction] = useState("");
  const [popup, setPopup] = useState({});

  const request = async () => {
    
    const res = await getUsersList();
    

    if (res.status === 200) {
      setUsers(res.data);
    }

    if (res.status >= 400) {
      setUsers([])
      setPopup({ text: res.data, type: "error" });
      displayPopup("error", ".control");
    }

    if (res.status >= 500) {
      setPopup({ text: "Error al conectar con el servidor", type: "error" });
      displayPopup("error", ".control");
    }

    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    screenEdit.style.zIndex = "-1";
    screenEdit.style.opacity = "0";
    screenEdit.style.visibility = "hidden";

    if (send === "register") {
      const res = await registerUser(user);
      if (res.status === 200) {
        request();
        setPopup({ text: res.data, type: "pass" });
        displayPopup("received");
      }
      if (res.status >= 400) {
        setPopup({ text: res.data, type: "error" });
        displayPopup("error");
      }

      if (res.status >= 500) {
        setPopup({ text: "Error al conectar con el servidor", type: "error" });
        displayPopup("error");
      }
    }

    if (send === "modify") {
      const res = await updateUser(user);
      if (res.status === 200) {
        request();
        setPopup({ text: res.data, type: "pass" });
        displayPopup("received");
      }
      if (res.status >= 400) {
        setPopup({ text: res.data, type: "error" });
        displayPopup("error");
      }

      if (res.status >= 500) {
        setPopup({ text: "Error al conectar con el servidor", type: "error" });
        displayPopup("error");
      }
    }
  };

  const deleteUsers = async (id) => {
    displayAlert(false);

    const res = await deleteUser(id);
    if (res.status === 200) {
      request();
      setPopup({ text: res.data, type: "pass" });
      displayPopup("received");
    }
    if (res.status >= 400) {
      setPopup({ text: res.data, type: "error" });
      displayPopup("error");
    }

    if (res.status >= 500) {
      setPopup({ text: "Error al conectar con el servidor", type: "error" });
      displayPopup("error");
    }
  };

  const questionAction = async () => {
    displayAlert(true);
    setAlert("Estas seguro de eliminar al usuario?");
    setAction("deleteUser");
  };

  useEffect(() => {
    if (rolUser !== "Admin") {
      return;
    }
    const requestUsers = async () => {
      
      const res = await getUsersList();

      if (res.status === 200) {
        setUsers(res.data);
      }

      if (res.status >= 400) {
        setPopup({ text: res.data, type: "error" });
        displayPopup("error", ".control");
      }

      if (res.status >= 500) {
        setPopup({ text: "Error al conectar con el servidor", type: "error" });
        displayPopup("error", ".control");
      }
      
    };
    requestUsers();

    setChangeUser({ rol: "Teacher" });
  }, []);

  const screenEdit = document.querySelector(".screen-edit-user");

  if (users.length === 0 && rolUser !== "Admin") {
    return (
      <React.Fragment>
        <Popup popup={popup} zone={"control"} />
        <Alert
          alert={alert}
          deleteUsers={deleteUsers}
          nameActions={action}
          userDelete={userDelete}
        />
        <Navbar active={3} />
        <div className="control-users">
          <h2>Administracion de Usuarios</h2>
          <p>
           No eres Administrador,por lo tanto no podras ver los usuarios
          </p>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Popup popup={popup} zone={"control"} />
      <Alert
        alert={alert}
        deleteUsers={deleteUsers}
        nameActions={action}
        userDelete={userDelete}
      />
      <Navbar active={3} />
      <div className="control-users">
        <h2>Administracion de Usuarios</h2>

        <div className="users-container" style={{ marginBottom: "10px" }}>
          {users.map((el, i) => {
            return (
              <div key={i} className="user">
                <div className="user-general">
                  <UserIcon
                    style={{
                      height: "32px",
                      margin: "auto 0",
                      marginRight: "10px",
                    }}
                  />

                  <div className="user-information">
                    <p style={{ margin: "2px 0" }}>
                      {`${el.firstName} ${el.lastName}`}
                    </p>
                    <div>
                      <EmailIcon style={{ height: "20px" }} />
                      <p>{el.email}</p>
                    </div>
                    <div>
                      <div>
                        <IdIcon style={{ height: "20px" }} />
                        <p>{el.ci}</p>
                      </div>
                      <div style={{ margin: "0 5px" }}>
                        <KeyIcon style={{ height: "20px" }} />
                        <p>
                          {el.rol.name === "Admin" ? "Administrador/a" : ""}
                          {el.rol.name === "Moderator" ? "Moderador/a" : ""}
                          {el.rol.name === "Teacher" ? "Maestro/a" : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="buttons-container-user">
                  <button
                    style={{ background: "#347fe0" }}
                    onClick={(e) => {
                      setChangeUser({
                        id: users[i]._id,
                        ci: users[i].ci,
                        firstName: users[i].firstName,
                        lastName: users[i].lastName,
                        email: users[i].email,
                        rol: users[i].rol.name,
                      });
                      setSend("modify");
                      setButtonName("Modificar Usuario");
                      screenEdit.style.zIndex = "10000";
                      screenEdit.style.opacity = "1";
                      screenEdit.style.visibility = "visible";
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={(e) => {
                      setUserDelete(users[i]._id);
                      questionAction();
                      setAction("deleteUsers");
                    }}
                    style={{ background: "#ce1c4b" }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="button-register-user"
          onClick={(e) => {
            setSend("register");
            setButtonName("Registrar Usuario");
            screenEdit.style.zIndex = "10000";
            screenEdit.style.opacity = "1";
            screenEdit.style.visibility = "visible";
          }}
        >
          Registrar Usuario
        </button>
      </div>

      <div className="container-login screen-edit-user">
        <form onSubmit={handleSubmit}>
          <h2 style={{ textAlign: "center" }}>Registro de usuario</h2>
          <div className="form-input">
            <label style={{ marginBottom: "10px" }}>Cedula</label>
            <input
              type="text"
              id="ci"
              name="ci"
              autoComplete="off"
              value={user.ci ? user.ci : ""}
              onChange={(e) => {
                setChangeUser({ ...user, ci: e.target.value });
              }}
              required
            />
          </div>
          <div className="form-input">
            <label style={{ marginBottom: "10px" }}>Nombre</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              autoComplete="off"
              value={user.firstName ? user.firstName : ""}
              onChange={(e) => {
                setChangeUser({ ...user, firstName: e.target.value });
              }}
              required
            />
          </div>
          <div className="form-input">
            <label style={{ marginBottom: "10px" }}>Apellido</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              autoComplete="off"
              value={user.lastName ? user.lastName : ""}
              onChange={(e) => {
                setChangeUser({ ...user, lastName: e.target.value });
              }}
              required
            />
          </div>
          <div className="form-input">
            <label style={{ marginBottom: "10px" }}>Correo Electronico</label>
            <input
              type="text"
              id="email"
              name="email"
              autoComplete="off"
              value={user.email ? user.email : ""}
              onChange={(e) => {
                setChangeUser({ ...user, email: e.target.value });
              }}
              required
            />
          </div>
          <div className="form-input">
            <label>Contraseña</label>

            <input
              type="text"
              id="password"
              name="password"
              autoComplete="off"
              style={{ width: "100%" }}
              value={user.password ? user.password : ""}
              onChange={(e) => {
                setChangeUser({ ...user, password: e.target.value });
              }}
            />

            <div
              style={{
                margin: "15px 0",
                flexDirection: "column",
                fontSize: "12px",
                textAlign: "center",
                display: send === "modify" ? "flex" : "none",
              }}
            >
              <label>Verificar cambio de contraseña</label>
              <input
                id="allowChange"
                type="checkbox"
                onChange={(e) => {
                  setChangeUser({ ...user, allowPassword: e.target.checked });
                }}
              />
            </div>
          </div>
          <div className="form-input">
            <label>Rol a desempeñar</label>
            <div>
              <select
                name="rols"
                id="rols"
                onChange={(e) => {
                  setChangeUser({ ...user, rol: e.target.value });
                }}
              >
                <option value="Teacher">Maestro/a</option>
                <option value="Moderator">Moderador/a</option>
                <option value="Admin">Administrador/a</option>
              </select>
            </div>
          </div>
          <div className="buttons-container-user buttons-control">
            <button
              type="button"
              onClick={(e) => {
                setChangeUser({ rol: "Teacher" });
                screenEdit.style.zIndex = "-1";
                screenEdit.style.opacity = "0";
                screenEdit.style.visibility = "hidden";
              }}
            >
              Regresar
            </button>
            <button type="submit">{buttonName}</button>{" "}
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default ControlUsers;
