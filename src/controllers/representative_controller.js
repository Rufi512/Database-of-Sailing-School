import representative from "../models/representative";
import { verifyForms } from "../middlewares";
import { parsePhoneNumber } from "awesome-phonenumber";
import mongoose from "mongoose";
export const register = async (req, res) => {
	try {
		const rep_data = req.body;
		const checkRep = await verifyForms.verifyRep(rep_data);
		if (checkRep === true) {
			const listPhone = rep_data.contact.phone_numbers;
			rep_data.contact.phone_numbers = listPhone.map((el) => {
				return {
					countryCode: el.countryCode,
					number: el.number,
					formatted: parsePhoneNumber(
						el.number,
						el.countryCode
					).getNumber(),
				};
			});
			//Register rep
			const newRep = new representative({
				ci: rep_data.ci,
				firstname: rep_data.firstname,
				lastname: rep_data.lastname,
				contact: rep_data.contact,
			});
			const savedRep = await newRep.save();
			res.json({
				message: "Representante registrado",
				rep_id: savedRep.id,
			});
		} else {
			return res.status(400).json({ message: checkRep.message });
		}
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Error fatal a ocurrido al registrar representante",
		});
	}
};

export const listSelect = async (req, res) => {
	try {
		const representatives = await representative.find(
			{},
			{ ci: 1, firstname: 1, lastname: 1 }
		);
		if (representatives.length <= 0) {
			return res
				.status(404)
				.json({ message: "No hay representantes disponibles" });
		}
		let newList = [];
		for (const rep of representatives) {
			newList.push({
				label: `${rep.ci} - ${rep.firstname} - ${rep.lastname}`,
				value: rep.id,
			});
		}
		res.json(newList);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Error en el servidor" });
	}
};

export const detail = async (req, res) => {
	try {
		const { id } = req.params;
		const foundRep = await representative.findOne({ _id: id });
		if (!foundRep)
			return res
				.status(404)
				.json({ message: "Representante no encontrado" });
		return res.json(foundRep);
	} catch (e) {
		console.log(e);
		res.status(500).json({
			message: "Ocurrio un error fatal al requerir informacion",
		});
	}
};

export const update = async (req, res) => {
	try {
		const { id } = req.params;
		const foundRep = await representative.findOne({ _id: id });
		if (!foundRep)
			return res
				.status(404)
				.json({ message: "Representante no encontrado" });
		const rep_data = req.body;
		const checkRep = await verifyForms.verifyRep(rep_data, id);
		if (checkRep !== true)
			return res.status(400).json({ message: checkRep.message });
		const listPhone = rep_data.contact.phone_numbers;
		rep_data.contact.phone_numbers = listPhone.map((el) => {
			return {
				countryCode: el.countryCode,
				number: el.number,
				formatted: parsePhoneNumber(
					el.number,
					el.countryCode
				).getNumber(),
			};
		});

		const { ci, firstname, lastname, contact } = rep_data;
		const updatedRep = await representative.updateOne(
			{ _id: foundRep.id },
			{
				$set: {
					ci: ci,
					firstname: firstname,
					lastname: lastname,
					contact: contact,
				},
			},
			{ upsert: true }
		);
		console.log(updatedRep);
		res.json({ message: "Información del representante actualizada" });
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Ocurrio un error fatal al actualizar representante",
		});
	}
};

export const deleteRep = async (req, res) => {
	try {
		const validId = mongoose.Types.ObjectId.isValid(req.params.id);
		if (!validId) return res.status(404).json({ message: "ID invalido" });

		const repFind = await representative.findById(req.params.id);
		if (repFind) {
			await representative.findByIdAndDelete(req.params.id);
		} else {
			return res
				.status(404)
				.json({ message: "Representante no encontrado" });
		}
		res.json("Representante Eliminado");
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Error en el servidor" });
	}
};

export const list = async (req, res) => {
	try {
		if (req.query) {
			const { limit, page, students } = req.query;
			if (limit && isNaN(limit))
				return res
					.status(400)
					.json({
						message: "El limite de elementos no es un numero!",
					});
			if (page && isNaN(page))
				return res
					.status(400)
					.json({ message: "El limite de paginas no es un numero!" });
			if (Number(students))
				return res
					.status(400)
					.json({ message: "La busqueda no es una cadena!" });
		}

		let optionsPagination = {
			lean: false,
			limit: req.query && Number(req.query.limit) ? req.query.limit : 10,
			page: req.query && Number(req.query.page) ? req.query.page : 1,
		};

		const reps = await representative.paginate({}, optionsPagination);

		if (reps.length === 1) {
			return res
				.status(404)
				.json({ message: "Representantes no encontrados" });
		}

		res.json(reps);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: "Error en el servidor" });
	}
};