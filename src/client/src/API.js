import axios from "axios";
import Cookies from "js-cookie";

//POST Login user

export const loginUser = async (user) => {
  const res = await axios.post("/api/auth/login", user).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data = "Falla en el servidor :("
      return err.response
    })
  
  return res
}

// POST reset password methods
export const forgotPasswordQuestions = async (user) => {
  const res = await axios.post("/api/auth/questions", user).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  
  return res
}

export const forgotPasswordEmail = async (user) => {
  const res = await axios.post("/api/auth/forgot-password", user).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  
  return res
}

export const forgotLinkQuestions = async (questions)=>{
  const res = await axios.post("/api/auth/questions/check", questions).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  
  return res
} 

export const resetPassword = async ({id,token,password})=>{
  console.log(id,token)
  const res = await axios.post(`/api/auth/reset-password/${id}/${token}`, {password}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  
  return res
} 

// List
export const sectionList = async ()=>{
  const res = await axios.get("/api/section/list/select",{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res.data
}

export const codesPhones = async () =>{
  const res = await axios.get("/api/auth/codes/phones",{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res.data
}

export const repsList = async () =>{
  const res = await axios.get("/api/rep/list/select",{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res.data
}

export const stats = async () =>{
  const res = await axios.get("/api/user/stats",{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res.data
}

//Get Students

//List

export const listStudents = async ({limit,page,queryStudent,search}) =>{
  const res = await axios.get(`/api/students/list?students=${queryStudent}&limit=${limit}&page=${page}&search=${search || ''}`,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

//Detail
export const detailStudent = async (id) =>{
  const res = await axios.get(`/api/students/info/${id}`,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

//Chest Student

export const chestStudent = async (id) =>{
   const res = await axios.get(`/api/chest/${id}`,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

//POST Students
export const registerStudent = async (data) =>{
  const res = await axios.post("/api/students/register",data,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

// PUT Student Score

export const updateScore = async (id,scores) =>{
  const res = await axios.put(`/api/students/scores/${id}`,scores,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

export const updateStudent = async (id,student) =>{
  const res = await axios.put(`/api/students/info/${id}`,student,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

//Delete Students

export const deleteStudentFromId = async (id,password) =>{
     const res = await axios.post("/api/students/delete",{ids:[id],password},{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}


//POST Reps
export const registerRep = async (data) =>{
  const res = await axios.post("/api/rep/register",data,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

//PUT Rep 

export const updateRep = async ({data,id}) =>{
  const res = await axios.put(`/api/rep/update/${id}`,data,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

//GET Reps

export const repDetail= async (id) =>{
  const res = await axios.get(`/api/rep/detail/${id}`,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

export const listReps = async ({limit,page}) =>{
   const res = await axios.get(`/api/rep/list?&limit=${limit}&page=${page}`,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

//Admin level request

//Delete Representative

export const deleteRepFromId = async ({id,password}) =>{
  const res = await axios.post(`/api/rep/delete/${id}`,{password},{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
} 

//POST Users

export const createUser = async (data) =>{
  const res = await axios.post("/api/user/register",data,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

export const updateUser = async ({data,id}) =>{
  const res = await axios.put(`/api/user/update/${id}`,data,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

export const detailUser = async (id) =>{
  const res = await axios.get(`/api/user/detail/${id}`,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

export const registerQuests = async ({id,questions}) =>{
  const res = await axios.post(`/api/auth/register/questions/${id}`,{quests:questions},{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

export const getQuestionsOnLogin = async (id) =>{
  const res = await axios.get(`/api/auth/questions/user/${id}`,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

export const listUsers = async ({limit,page}) =>{
  const res = await axios.get(`/api/user/list?&limit=${limit}&page=${page}`,{headers: { "x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
}

export const deleteUserFromId = async ({id,password}) =>{
  console.log(id,password)
  const res = await axios.post(`/api/user/delete/${id}`,{password},{headers:{"x-access-token": Cookies.get("token") }}).catch((err) => {
      if(err.response.status <= 500){
        return err.response
      }
      err.response.data.message = "Falla en el servidor :("
      return err.response
    })
  return res
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