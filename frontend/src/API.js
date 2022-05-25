import axios from "axios";
import Cookies from "js-cookie";

//GET

export const studentsList = async (students,params) => {
    console.log(params)

  if (students === "studentsActive") {
    const res = await axios.get(`/api/students/actives${params.limit ? `/?limit=${params.limit ? params.limit : 10}&page=${params.page ? params.page : 1}` : `/${params}`}`, {
        headers: { "x-access-token": Cookies.get("token") },
      }).catch((err) => {
        console.log(err)
        return err.response
      })
    
    
    if (res.status === 401) {
      alert("Token vencido o perdido")
      Cookies.remove("token")
      Cookies.remove("rol")
      window.location.href = "/"
      return
    }
    return res
  }

  if (students === "studentsInactive") {
    const res = await axios.get(`/api/students/inactives${params.limit ? `/${params}` : `/${params}`}`, {
        headers: { "x-access-token": Cookies.get("token") },
      }).catch((err) => {
        console.log(err)
        return err.response
      })

    
    if (res.status === 401) {
      alert("Token vencido o perdido")
      Cookies.remove("token")
      Cookies.remove("rol")
      window.location.href = "/"
      return
    }
    return res
  }

  if (students === "studentsGradues") {
    const res = await axios.get(`/api/students/gradues${params.limit ? `/${params}` : `/${params}`}`, {
        headers: { "x-access-token": Cookies.get("token") },
      }).catch((err) => {
        console.log(err)
        return err.response
      })
    
    if (res.status === 401) {
      alert("Token vencido o perdido")
      Cookies.remove("token")
      Cookies.remove("rol")
      window.location.href = "/"
      return
    }
    return res
  }
}

export const studentInformation = async (id) => {
  const res = await axios.get("/api/students/info/" + id, {
      headers: { "x-access-token": Cookies.get("token") },
    }).catch((err) => {
      console.log(err)
      return err.response
    })
  
  if (res.status === 401) {
    alert("Token vencido o perdido")
    Cookies.remove("token")
    Cookies.remove("rol")
    window.location.href = "/"
    return
  }
  return res
}

export const getSectionMax = async () => {
  const res = await axios.get("/api/students/sections/max", {
      headers: { "x-access-token": Cookies.get("token") },
    }).catch((err) => {
      console.log(err)
      return err.response
    })
  
  if (res.status === 401) {
    alert("Token vencido o perdido")
    Cookies.remove("token")
    Cookies.remove("rol")
    window.location.href = "/"
    return
  }
  return res
}

export const getUsersList = async () => {
  const res = await axios.get("/api/user/list", {
      headers: { "x-access-token": Cookies.get("token") },
    }).catch((err) => {
      console.log(err)
      return err.response
    })
  
  if (res.status === 401) {
    alert("Token vencido o perdido")
    Cookies.remove("token")
    Cookies.remove("rol")
    window.location.href = "/"
    return
  }
  return res
}

//POST

export const loginUser = async (user) => {
  const res = await axios.post("/api/auth/login", user).catch((err) => {
      console.log(err)
      return err.response
    })
  
  if(res.status === 200){
    Cookies.set('token', res.data.token);
    Cookies.set('rol', res.data.rol);
  }
  return res
}

export const resetPassword = async (changePass) =>{
   const res = await axios.post("/api/user/change/password", changePass).catch((err) => {
      console.log(err)
      return err.response
    })
  return res
} 

export const registerUser = async (user) => {
  const res = await axios.post("/api/user/register", user, {
      headers: { "x-access-token": Cookies.get("token") },
    }).catch((err) => {
      console.log(err)
      return err.response
    })
  
  if (res.status === 401) {
    alert("Token vencido o perdido")
    Cookies.remove("token")
    Cookies.remove("rol")
    window.location.href = "/"
    return
  }
  return res
}

export const registerStudent = async (values) => {
  const res = await axios.post("/api/students/register", values, {
      headers: { "x-access-token": Cookies.get("token") },
    }).catch((err) => {
      console.log(err)
      return err.response
    })

  
  if (res.status === 401) {
    alert("Token vencido o perdido")
    Cookies.remove("token")
    Cookies.remove("rol")
    window.location.href = "/"
    return
  }
  return res
}

export const registerStudents = async (archive) => {
  const res = await axios.post("/api/students/register/file", archive, {
      headers: { "x-access-token": Cookies.get("token") },
    }).catch((err) => {
      console.log(err)
      return err.response
    })

  
  if (res.status === 401) {
    alert("Token vencido o perdido")
    Cookies.remove("token")
    Cookies.remove("rol")
    window.location.href = "/"
    return
  }
  return res
}

export const studentsSection = async (section) =>{
     const res = await axios.post("/api/students/section", {school_year:section},{
      headers: { "x-access-token": Cookies.get("token") },
    }).catch((err) => {
      console.log(err)
      return err.response
    })

    if (res.status === 401) {
    alert("Token vencido o perdido")
    Cookies.remove("token")
    Cookies.remove("rol")
    window.location.href = "/"
    return
  }

  return res
}

export const commentStudent = async (id, comment) => {
  const res = await axios.post(
      "/api/students/comment/" + id,
      { comment },
      { headers: { "x-access-token": Cookies.get("token") } }).catch((err) => {
      console.log(err)
      return err.response
    })
  
  if (res.status === 401) {
    alert("Token vencido o perdido")
    Cookies.remove("token")
    Cookies.remove("rol")
    window.location.href = "/"
    return
  }
  return res
}

//PUT

export const gradeStudent = async (value, ids) => {
  if (value === "upgrade") {
    const res = await axios.put("/api/students/graduate", ids, {
        headers: { "x-access-token": Cookies.get("token") },
      }).catch((err) => {
        console.log(err)
        return err.response
      })
    
    if (res.status === 401) {
      alert("Token vencido o perdido")
      Cookies.remove("token")
      Cookies.remove("rol")
      window.location.href = "/"
      return
    }
    return res
  }

  if (value === "degrade") {
    const res = await axios.put("/api/students/demote", ids, {
        headers: { "x-access-token": Cookies.get("token") },
      }).catch((err) => {
        console.log(err)
        return err.response
      })
    
    if (res.status === 401) {
      alert("Token vencido o perdido")
      Cookies.remove("token")
      Cookies.remove("rol")
      window.location.href = "/"
      return
    }
    return res
  }
}

export const academicInformation = async (id, values) => {
  const res = await axios.put("/api/students/info/" + id, values, {
      headers: { "x-access-token": Cookies.get("token") },
    }).catch((err) => {
      console.log(err)
      return err.response
    })
  
  if (res.status === 401) {
    alert("Token vencido o perdido")
    Cookies.remove("token")
    Cookies.remove("rol")
    window.location.href = "/"
    return
  }
  return res
}

export const updateUser = async (user) => {
  const res = await axios.put("/api/user/update/" + user.id, user, {
      headers: { "x-access-token": Cookies.get("token") },
    }).catch((err) => {
      console.log(err)
      return err.response
    })
  
  if (res.status === 401) {
    alert("Token vencido o perdido")
    Cookies.remove("token")
    Cookies.remove("rol")
    window.location.href = "/"
    return
  }
  return res
}

//DELETE

export const deleteUser = async (id) => {
  const res = await axios.delete("/api/user/delete/" + id, {
      headers: { "x-access-token": Cookies.get("token") },
    }).catch((err) => {
      console.log(err)
      return err.response
    })
  
  if (res.status === 401) {
    alert("Token vencido o perdido")
    Cookies.remove("token")
    Cookies.remove("rol")
    window.location.href = "/"
    return
  }
  return res
}

export const deleteStudents = async (ids) => {
  const res = await axios.post("/api/students/delete", ids, {
      headers: { "x-access-token": Cookies.get("token") },
    }).catch((err) => {
      console.log(err)
      return err.response
    })
  
  if (res.status === 401) {
    alert("Token vencido o perdido")
    Cookies.remove("token")
    Cookies.remove("rol")
    window.location.href = "/"
    return
  }
  return res
}

export const deleteComments = async (id) => {
  const res = await axios.delete("/api/students/comment/delete/" + id, {
      headers: { "x-access-token": Cookies.get("token") },
    }).catch((err) => {
      console.log(err)
      return err.response
    })
  
  if (res.status === 401) {
    alert("Token vencido o perdido")
    Cookies.remove("token")
    Cookies.remove("rol")
    window.location.href = "/"
    return
  }
  return res
}
