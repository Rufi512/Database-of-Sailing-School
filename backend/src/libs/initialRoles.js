import role from '../models/roles'

export const createRoles = async () =>{
  try{

  const count = await role.estimatedDocumentCount()

  if (count > 0 ) return;
  
  const values =  await Promise.all([
     new role({name:'Admin'}).save(),
     new role({name:'Moderator'}).save(),
     new role({name:'Teacher'}).save()
  ])

  console.log(values)
 
  } catch (err){
    console.log(err)
  }

}