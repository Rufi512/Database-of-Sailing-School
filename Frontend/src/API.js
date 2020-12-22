import axios from 'axios'

//GET
export const studentsList = async (students) => {
  let connection = true
  if (students === "studentsActive") {
    const res = await axios.get('/students/Actives').catch((err) => {return connection = false})

    if (connection === false) {
      return (false)
    }
    if (res.data.length === 0) {
      return ('nothingActive')
    }

    return (res.data)

  }

  if (students === "studentsInactive") {
    const res = await axios.get('/students/Inactives').catch((err) => {return connection = false})

    if (connection === false) {
      return (false)
    }
    if (res.data.length === 0) {
      return ('nothingInactive')
    }

    return (res.data)

  }

  if (students === "studentsGradues") {
    const res = await axios.get('/students/Gradues').catch((err) => {return connection = false})

    if (connection === false) {
      return (false)
    }
    if (res.data.length === 0) {
      return ('nothingGradues')
    }

    return (res.data)
  }
}

export const studentInformation = async (id) => {
  let result = null
  const res = await axios.get('/student/Info/' + id).catch((err) => {result = err})
  if (result) {
    return (false)
  }

  if (res.status === 200) {
    return (res.data)
  }
}

//POST
export const registerStudent = async (values) => {
  let result = null
  const res = await axios.post('/regStudent', values).catch((err) => {result = err;});
  if (result) {
    return (false)
  }
  if (res.data === 'null') {
    return ('register')
  } else {
    return ('Previously registered')
  }
}

export const gradeStudent = async (value, ids) => {
  let result = null
  if (value === 'upgrade') {
    const res = await axios.put('/student/Upgrade', ids).catch((err) => {result = err})
    if (result) {
      return (false)
    }

    if (res.status === 200) {
      return (true)
    }
  }

  if (value === 'degrade') {
    const res = await axios.put('/student/Degrade', ids).catch((err) => {result = err})
    if (result) {
      return (false)
    }

    if (res.status === 200) {
      return (true)
    }
  }

}

export const deleteStudents = async (ids) => {
  let result = null
  const res = await axios.post('/student/Delete', ids).catch((err) => {result = err})
  if (result) {
    return (false)
  }
  if (res.status === 200) {
    return (true)
  }
}

export const commentStudent = async (id, comment) => {
  let result = null
  const res = await axios.post('/student/Commit/' + id, {comment}).catch((err) => {result = err})
  if (result) {
    return (false)
  }

  if (res.status === 200) {
    return (true)
  }
}

export const deleteComments = async (id, index) => {
  let result = null
  const res = await axios.post('/student/deleteCommit/' + id, {index}).catch((err) => {result = err})

  if (result) {
    return (false)
  }

  if (res.status === 200) {
    return (true)
  }
}

//PUT
export const academicInformation = async (id, values) => {
  let result = null
  const res = await axios.put('/student/Form/' + id, values).catch((err) => {result = err;})
  if (result) {
    return (false)
  }
  if (res.status === 200) {
    return (true)
  } else {
    return (false)
  }
}
