import React,{useState,useEffect} from 'react'

export const InfoAcademic = (props) =>{
  const [subjects,setSubjects] = useState([])
 
  useEffect(()=>{
        setSubjects(props.information)

  },[props])

  if(subjects === undefined){
    return(
    <div className="alert-history">
            <p>La informacion solicitada aun no esta disponible!</p>
      </div>
    )}
  if(subjects === null){
    return(
   '' 
    )
  }
  return(
<table className="student-notes">
          <thead>
            <tr>
              <th colSpan="5">Informacion Academica</th>
            </tr>
            <tr>
              <th>Materias</th>
              <th>Lapso 1</th>
              <th>Lapso 2</th>
              <th>Lapso 3</th>
              <th rowSpan="1">Promedio</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subjects, i) =>
              <tr key={i}>
                <td>{subjects.name}</td>
                <td>{subjects.score[0]}</td>
                <td>{subjects.score[1]}</td>
                <td>{subjects.score[2]}</td>
                <td>{Math.round((subjects.score[0] + subjects.score[1] + subjects.score[2]) / 3)}</td>
              </tr>
            )}

          </tbody>
        </table>

  )
}
