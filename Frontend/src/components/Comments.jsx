import React, {useState, useEffect} from 'react'
import {deleteComments} from '../API.js'
import trashSvg from '../components/resources/icons/trash-solid.svg'

export const Comments = (props) => {
  const [commits, setCommits] = useState(null)
  const [studentInfo, setStudentInfo] = useState(false)
  const [gradue, setGradue] = useState("")
  useEffect(() => {
    setCommits(props.comments)
    if (props.comments === [] || props.comments === undefined || props.comments.length === 0) {
      setCommits(null)
    } else {
      setCommits(props.comments)
    }
    setStudentInfo(props.studentInfo)
    setGradue(props.gradue)

  }, [props])


  //Borra los comentarios
  async function deleteComment(index) {
    const result = await deleteComments(props.id, index)
    if (result === true) {
      props.actions(props.id)
    }
  }

  if (gradue === "Graduado" && commits === null && studentInfo === true) {
    return ('')
  }

  if (commits === null && studentInfo === false) {
    return (<React.Fragment>
      <br />
      <div className="alert-history" style={{width: '100%'}}><p>No se registraron comentarios en este año escolar</p></div>
      <br />
    </React.Fragment>)
  }

  if (commits === null && studentInfo === true) {
    return (<React.Fragment>
      <br />
      <div className="alert-history" style={{width: '100%'}}><p>No se han registrado comentarios </p></div>
      <br />
    </React.Fragment>)

  }

  if (commits !== null && studentInfo === true) {
    return (
      <React.Fragment>
        <h3>Comentarios</h3>
        <div className="box-comment" style={{width: '100%'}}>
          {commits.map((commits, i) =>
            <div className="commit" key={i}>

              <div>
                <p style={{'whiteSpace': 'pre-line'}}>{commits.comment}</p>
                <p>Comentado por: <span>{commits.author}</span></p>
                <p>{commits.date_comment}</p>
              </div>

              <div>
                <img className="icon" src={trashSvg} alt="trash" onClick={(e) => deleteComment(i)} />
                <span className="tooltip">Eliminar</span>
              </div>
            </div>
          )}

        </div>


      </React.Fragment>
    )
  }

  if (commits !== null && studentInfo === false) {
    return (
      <React.Fragment>
        <h3>Comentarios</h3>
        <div className="box-comment" style={{width: '100%'}}>
          {commits.map((commits, i) =>
            <div className="commit" key={i}>

              <div>
                <p style={{'whiteSpace': 'pre-line'}}>{commits.comment}</p>
                <p>Comentado por: <span>{commits.author}</span></p>
                <p>{commits.date_comment}</p>
              </div>


            </div>
          )}

        </div>


      </React.Fragment>
    )



  }



}
