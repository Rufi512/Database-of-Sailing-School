import React, {useState, useEffect} from 'react'

export const InfoBasic = (props) => {

  const [student, setStudent] = useState({})

  useEffect(() => {
    setStudent(props.student)
  }, [props])

  return (
    <table className="student-general">

      <thead>
        <tr>
          <th>Cedula</th> <th>Nombre</th> <th>Apellido</th> <th>Curso</th> <th>Estado</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>{student.ci}</td> <td>{student.firstName}</td> <td>{student.lastName}</td> <td>{student.school_year}</td> <td>{student.status ? 'Activo' : 'Inactivo'}</td>
        </tr>
      </tbody>

    </table>

  )
}
