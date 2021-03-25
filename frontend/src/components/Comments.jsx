import React, { useState, useEffect } from "react";
import { deleteComments } from "../API.js";
import trashSvg from "../static/icons/trash-solid.svg";

export const Comments = (props) => {
  const [comments, setcomments] = useState([]);
  const [studentInfo, setStudentInfo] = useState(false);
  const [gradue, setGradue] = useState("");

  useEffect(() => {
    setcomments(props.comments);
    setStudentInfo(props.studentInfo);
    setGradue(props.gradue);
  }, [props]);

  //Borra los comentarios
  async function deleteComment(id) {
    const result = await deleteComments(id);

    if (result.status === 200) {
      props.actions(props.studentId);
    }
  }

  if (gradue === "Graduado" && studentInfo === true) {
    return "";
  }

  if (
    !comments.find((el) => el.school_year === props.year) &&
    studentInfo === false
  ) {
    return (
      <React.Fragment>
        <br />
        <div className="alert-history" style={{ width: "100%" }}>
          <p>No se registraron comentarios en este año escolar</p>
        </div>
        <br />
      </React.Fragment>
    );
  }

  if (
    !comments.find((el) => el.school_year === props.school_year) &&
    studentInfo === true
  ) {
    return (
      <React.Fragment>
        <br />
        <div className="alert-history" style={{ width: "100%" }}>
          <p>No se han registrado comentarios </p>
        </div>
        <br />
      </React.Fragment>
    );
  }

  if (studentInfo === true) {
    return (
      <React.Fragment>
        <h3>Comentarios</h3>
        <div className="box-comment" style={{ width: "100%" }}>
          {comments.map((comment, i) => {
            if (comment.school_year === props.school_year) {
              return (
                <div className="commit" key={i}>
                  <div>
                    <p style={{ whiteSpace: "pre-line" }}>{comment.comment}</p>
                    <p>
                      Comentado por:{" "}
                      <span>{`${comment.firstName} ${comment.lastName}`}</span>
                    </p>
                    <p>{comment.create_at}</p>
                  </div>

                  <div>
                    <img
                      className="icon"
                      src={trashSvg}
                      alt="trash"
                      onClick={(e) => {
                        deleteComment(comment._id);
                      }}
                    />
                    <span className="tooltip">Eliminar</span>
                  </div>
                </div>
              );
            }
            return "";
          })}
        </div>
      </React.Fragment>
    );
  }

  if (studentInfo === false) {
    return (
      <React.Fragment>
        <h3>Comentarios</h3>
        <div className="box-comment" style={{ width: "100%" }}>
          {comments.map((comment, i) => {
            if (comment.school_year === props.year) {
              return (
                <div className="commit" key={i}>
                  <div>
                    <p style={{ whiteSpace: "pre-line" }}>{comment.comment}</p>
                    <p>
                      Comentado por:{" "}
                      <span>{`${comment.firstName} ${comment.lastName}`}</span>
                    </p>
                    <p>{comment.create_at}</p>
                  </div>
                </div>
              );
            }
            return "";
          })}
        </div>
      </React.Fragment>
    );
  }
};
