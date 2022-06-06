import chest from '../models/chest'

export const info = async (req,res) =>{
	const id = req.params.id // id from student
	const archiveFound = await chest.findOne({student:id})
	if(!archiveFound) return res.status(404).json({message:'Informacion de estudiante no encontrada'})
	return res.json(archiveFound)
}