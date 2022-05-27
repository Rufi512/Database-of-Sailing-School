import representative from '../models/representative'
import {verifyForms} from '../middlewares'

export const register = async(req,res) =>{
try{
	const rep_data = req.body;
	const checkRep = await verifyForms.verifyRep(rep_data)
	if(checkRep === true){
      //Register rep
      const newRep = new representative({
        ci:rep_data.ci,
        firstname:rep_data.firstname,
        lastname:rep_data.lastname,
        contact:rep_data.contact
      })
      const savedRep = await newRep.save()
      res.json({message:'Representante registrado', rep_id:savedRep.id})
    }else{
      return res.status(400).json({message:checkRep.message})
    }
  }catch(err){
  	console.log(err)
  	res.status(500).json({message:'Error fatal a ocurrido al registrar representante'})
  }
}


export const update = async (req,res)=>{	
try{
	const {id} = req.params
	const foundRep = await representative.findOne({_id:id})
	if(!foundRep) return res.status(404).json({message:'Representante no encontrado'})
	const rep_data = req.body;
	const checkRep = await verifyForms.verifyRep(rep_data,id)
	if(checkRep !== true) return res.status(400).json({message: checkRep.message})
	const {ci,firstname,lastname,contact} = rep_data
	await representative.updateOne({_id:foundRep.id},{$set:{
		ci:ci,
		firstname:firstname,
		lastname:lastname,
		contact:contact
	}},{upsert:true})

	res.json({message:'Información del representante actualizada'})
}catch(err){
	console.log(err)
	res.status(500).json({message:'Ocurrio un error fatal al actualizar representante'})
}
}
