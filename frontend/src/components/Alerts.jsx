import React, { useState, useEffect } from "react";

export const displayPopup = (status, zone) => {
  document.querySelector(".popup").style.transform = "translateY(-110%)";

  let Zone = null;
  if (zone !== undefined || zone !== null || zone !== "") {
    Zone = zone;
  }
  if (zone === undefined) {
    Zone = ".popup";
  }

  const displayPopup = document.querySelector(Zone);
  displayPopup.style.transform = "translateY(-110%)";

  setTimeout(() => {
    displayPopup.style.transform = "translateY(0%)";
  }, 500);

  if (status === "received") {
    setTimeout(() => {
      displayPopup.style.transform = "translateY(-110%)";
    }, 5000);
  }

  if (status === "hidden") {
    displayPopup.style.transform = "translateY(-110%)";
  }
};

export const displayAlert = (value) => {
  const alert = document.querySelector(".alert");
  if (value === true) {
    alert.style.visibility = "visible";
    alert.style.opacity = "1";
    alert.style.zIndex = "10000";
  } else {
    alert.style.visibility = "collapse";
    alert.style.opacity = "0";
    alert.style.zIndex = "-100";
  }
};

export const Popup = (props) => {
  const [popupText, setPopupText] = useState("");
  const [zone, setZone] = useState("");
  const [type, setType] = useState("");
  useEffect(() => {
    setPopupText(props.popup.text);
    setType(props.popup.type);
    setZone(props.zone);
  }, [props]);

  return (
    <div className={`popup ${type ? type : ""} ${zone ? zone : ""}`}>
      <p>{popupText ? popupText : ""}</p>
    </div>
  );
};

export const Alert = (props) => {
  const [alerts, setAlerts] = useState("");

  useEffect(() => {
    setAlerts(props.alert);
  }, [props]);

  return (
    <div className="alert">
      <div>
        <p style={{ textAlign: "center" }}>{alerts ? alerts : ""} </p>
        <div className="buttons-container">
          <button
           style={{margin: "2px 10px"}}
            className="btn btn-cancel"
            onClick={(e) => {
              displayAlert(false);
            }}
          >
            Cancelar
          </button>
          <button
            className="btn btn-confirm"
            style={{margin: "2px 10px"}}
            onClick={(e) => {
              if (props.nameActions === "upgradeAndDegrade") {
                props.upgradeAndDegrade(props.confirm);
              }
              if (props.nameActions === "delete") {
                props.deleteStudent(props.confirm);
              }
            }}
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};