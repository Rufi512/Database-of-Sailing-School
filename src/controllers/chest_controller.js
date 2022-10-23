import chest from "../models/chest";

export const info = async (req, res) => {
	try {
		const id = req.params.id; // id from student
		if (!id)
			return res
				.status(404)
				.json({ message: "Estudiante no encontrado" });
		const archiveFound = await chest.findOne(
			{ student: id },
			{ "data.subjects.subject._id": 0 }
		);
		if (!archiveFound)
			return res
				.status(404)
				.json({ message: "Informacion de estudiante no encontrada" });
		return res.json(archiveFound);
	} catch (e) {
		console.log(e);
		return res
			.status(500)
			.json({ message: "Error al requerir la informacion" });
	}
};