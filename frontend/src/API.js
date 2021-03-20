import axios from "axios";

//GET
export const studentsList = async (students) => {
  if (students === "studentsActive") {
    const res = await axios.get("/api/students/actives").catch((err) => {
      return err.response;
    });
    return res;
  }

  if (students === "studentsInactive") {
    const res = await axios.get("/api/students/inactives").catch((err) => {
      return err.response;
    });
    return res;
  }

  if (students === "studentsGradues") {
    const res = await axios.get("/api/students/gradues").catch((err) => {
      return err.response;
    });
    return res;
  }
};

export const studentInformation = async (id) => {
  const res = await axios.get("/api/students/info/" + id).catch((err) => {
    return err.response;
  });
  return res;
};

//POST
export const registerStudent = async (values) => {
  const res = await axios.post("/api/students/register", values).catch((err) => {
    return err.response;
  });

  return res;
};

export const registerStudents = async (archive) => {
  const res = await axios
    .post("/api/students/register/file", archive)
    .catch((err) => {
      return err.response;
    });

  return res;
};

export const gradeStudent = async (value, ids) => {
  if (value === "upgrade") {
    const res = await axios.put("/api/students/graduate", ids).catch((err) => {
      return err.response;
    });
    return res;
  }

  if (value === "degrade") {
    const res = await axios.put("/api/students/demote", ids).catch((err) => {
      return err.response;
    });
    return res;
  }
};

export const deleteStudents = async (ids) => {
  const res = await axios.post("/api/students/delete", ids).catch((err) => {
    return err.response;
  });
  return res;
};

export const commentStudent = async (id, comment) => {
  const res = await axios
    .post("/api/students/comment/" + id, { comment })
    .catch((err) => {
      return err.response;
    });
  return res;
};

export const deleteComments = async (id, index) => {
  const res = await axios
    .post("/api/students/comment/delete/" + id, { index })
    .catch((err) => {
      return err.response;
    });
  return res;
};

//PUT
export const academicInformation = async (id, values) => {

  const res = await axios.put("/api/students/info/" + id, values).catch((err) => {return err.response});
  
  return res
};
