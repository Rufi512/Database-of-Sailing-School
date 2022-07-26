import roles from '../models/roles'
import user from "../models/user";
import subject from '../models/subject'
import {subjectsInitials} from '../libs/subjects'
export const initialSetup = async () =>{
  try{

   const foundSubjects = await subject.find()
   if(foundSubjects.length <= 0){
     for(const subjectInf of subjectsInitials ){
       const newSubject = new subject({
           name:subjectInf.name.toLowerCase(),
           fromYears:subjectInf.fromYears
       })
       await newSubject.save()
     }
     console.log('Materias Creadas!')
   }


  //Create rols
  const count = await roles.estimatedDocumentCount()

  if (count > 0 ) return;
  
  const values =  await Promise.all([
     new roles({name:'Admin'}).save(),
     new roles({name:'Moderator'}).save(),
     new roles({name:'Teacher'}).save()
  ])

  console.log('Roles creados')

  //Create user Admin
  const findUser = await user.findOne({ ci: 12345 });
    const foundRoles = await roles.find({ name: { $in: "Admin" } });
    if (!findUser) {
      let rolFind = null;
      if (foundRoles) {
        for (const rol of foundRoles) {
          rolFind = rol._id;
        }
      } else {
        console.log("Rol no encontrado");
      }

      const newUser = new user({
        ci: "12345",
        firstname: "Chente",
        lastname: "Director",
        email: "chente@mail.com",
        password: await user.encryptPassword("12345"),
        rol: rolFind,
      });
      const userCreated = await newUser.save();
      console.log("Administrador creado!");

    }

  

 
 
  } catch (err){
    console.log(err)
  }

}