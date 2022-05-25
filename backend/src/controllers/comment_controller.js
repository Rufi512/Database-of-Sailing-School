import student from "../models/student"
import comment from "../models/comment"
import dateFormat from "dateformat";
import mongoose from "mongoose";
import { date } from "../libs/dateformat";
let now = new Date();
dateFormat.i18n = date;

//Consulta comentarios
export const getComments = async (id) =>{
  const comments = await student.aggregate([
  { $match: { _id: mongoose.Types.ObjectId(id) } },
  {
    $lookup: {
      from: "comments",
      localField: "_id",
      foreignField: "student",
      as: "comment",
    },
  },
  { $unwind: "$comment" },
  {
    $lookup: {
      from: "users",
      localField: "comment.user",
      foreignField: "_id",
      as: "author",
    },
  },
  { $unwind: "$author" },
  {
    $project: {
      _id: "$comment._id",
      firstName: "$author.firstname",
      lastName: "$author.lastname",
      school_year: "$comment.school_year",
      comment: "$comment.comment",
      create_at: "$comment.create_at",
    },
  },
])

  return comments
}


//Registra comentario

export const commentStudent = async (req, res) => {
  now = new Date();
  const studentFind = await student.findById(req.params.id);

  if(!studentFind) return res.status(404).json({message:'Estudiante no encontrado'})

  const newComment = new comment({
    user:req.userId,
    student:req.params.id,
    comment:req.body.comment,
    school_year:studentFind.school_year,
    create_at: dateFormat(now, "dddd, d De mmmm , yyyy, h:MM:ss TT"),
  });
  
  newComment.save()
  res.json({message:'Comentario añadido'})
};

//Borra comentario

export const uncomment = async (req, res) => {
  await comment.findByIdAndDelete(req.params.id)
  res.json({message:"Comentario eliminado"});
};
