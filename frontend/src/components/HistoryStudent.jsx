import React, { useState, useEffect } from "react";
import { InfoBasic } from "./InfoBasic";
import { InfoAcademic } from "./InfoAcademic";
import { Comments } from "./Comments";
import { changeView, switchYear, switchActive } from "./SomethingFunctions";
export const HistoryStudent = (props) => {
  let buttonNumber = -1
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function load() {
      setHistory(props.record);
    }
    load();
  }, [props]);

  if (!history[0] && !history[1] && !history[2] && !history[3] && !history[4]) {
    return (
      <div className="alert-history view-history" style={{ margin: "auto" }}>
        <p style={{ margin: "20px auto" }}>
          La informacion solicitada aun no esta disponible!
        </p>
      </div>
    );
  }

  return (
    <div
      style={{ display: props.gradue === "Graduado" ? "flex" : "" }}
      className="container-student view-history"
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          marginBottom: "15px",
        }}
      >
        <div style={{ display: props.gradue === "Graduado" ? "none" : "" }}>
          <button
            className="btn"
            type="button"
            onClick={(e) => {
              changeView("general");
            }}
          >
            Regresar
          </button>
        </div>
        <p style={{ display: props.gradue === "Graduado" ? "none" : "" }}>
          Secciones cursadas
        </p>
        <div className="buttons-container-history">
          {
            

            history.map((el, i) => {
            
            if (el) {
              buttonNumber += 1
              return (
                <button
                  className={`btn-history ${
                    i === 0 ? "btn-active-history" : ""
                  }`}
                  data-index={buttonNumber}
                  onClick={(e) => {
                    switchYear(e.target.dataset.index);
                    switchActive(e.target.dataset.index);
                  }}
                  key={i}
                >
                  {el.school_year}
                </button>
              );
              
            }
            return "";
          })}
        </div>
      </div>

      <div className="slide-history">
        {history.map((el, i) => {
          if (el) {
            return (
              <div className="container-history" key={i}>
                <InfoBasic
                  student={props.student}
                  zone={"HistoryStudent"}
                  gradue={props.gradue}
                />
                <InfoAcademic information={el.subjects} />
                <br />
                <Comments
                  comments={props.comments}
                  year={el.school_year}
                  studentInfo={false}
                />
              </div>
            );
          }
          return "";
        })}
      </div>
    </div>
  );
};
