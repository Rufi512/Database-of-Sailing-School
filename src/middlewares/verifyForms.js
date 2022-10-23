import student from '../models/student'
import representative from '../models/representative'
import { parsePhoneNumber } from 'awesome-phonenumber'

export const validateEmail = (mail) => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail) || mail === "") {
        return (true)
    }
    return (false)
}

export const validateNumber = (phone) => {
    const pn = parsePhoneNumber(phone.number, phone.countryCode);
    if (pn.isValid()) return true
    return false
}


export const verifyCreate = async (data) => {
    const { ci, firstname, lastname, contact } = data;

    if (!Number(ci) || !Number.isInteger(Number(ci)) || Number(ci) < 0) {
        return { message: "Parámetros en Cédula inválidos,solo números!" }
    }

    if (ci.length < 4) {
        return { message: "Cedula invalida" }
    }

    if (!/^[A-Za-záéíóúñ'´ ]+$/.test(firstname)) {
        return { message: "Parámetros en Nombre inválidos" };
    }

    if (firstname.length > 45) {
        return { message: "Nombres muy largos maximo 45 caracteres" };
    }

    if (!/^[A-Za-záéíóúñ'´ ]+$/.test(lastname)) {
        return { message: "Parámetros en Apellido inválidos" };
    }

    if (lastname.length > 45) {
        return { message: "Apellidos muy largos maximo 45 caracteres" };
    }

    if (contact) {
        const emails = contact.emails
        const phones = contact.phone_numbers
        const invalidsEmails = emails.filter((el) => !validateEmail(el))
        const invalidsPhones = phones.filter((el) => !validateNumber(el))
        //const invalidsPhones = phones.filter
        //Validation
        if (invalidsEmails.length > 0) return { message: 'Email/s de estudiante invalido' }
        if (invalidsPhones.length > 0) return { message: 'Telefono/s de estudiante invalido' }

        if(contact.address_1 && contact.address_1.length > 150) return {message: 'La direccion debe de tener maximo 150 caracteres!'}
        if(contact.address_2 && contact.address_2.length > 150) return {message: 'La direccion debe de tener maximo 150 caracteres!'}
    }

    const studentFind = await student.findOne({ ci: ci });

    if (studentFind) return { message: "El estudiante ha sido registrado anteriormente en el sistema!" };

    return false

}


export const verifyXls = async (data, rows,studentsRegister) => {
    const [ ci, firstname, lastname ] = data
    if (!Number(ci)) {
        return { message: `La cedula del estudiante en la fila ${rows} es invalida` }
    }

    if (!/^[A-Za-záéíóúñ'´ ]+$/.test(firstname)) {
        return { message: `El nombre del estudiante en la fila: ${rows} contiene caracteres invalidos` }
    }

    if (!/^[A-Za-záéíóúñ'´ ]+$/.test(lastname)) {
        return { message: `El apellido del estudiante en la fila: ${rows} contiene caracteres invalidos` }

    }

    if (firstname.length > 30) {
        return { message: `El nombre del estudiante en la fila: ${rows} es muy largo` }
    }

    if (lastname.length > 30) {
        return { message: `El apellido del estudiante en la fila: ${rows} contiene caracteres invalidos` }
    }


    const studentFind = await student.findOne({ ci: Number(ci) });
    if (studentFind) {
        return { message: `El estudiante de la fila: ${rows} ha sido registrado anteriormente` }
    }

    if (studentsRegister.find((el) => el === Number(ci))) {
        return { message: '' }
    }

    return true;

}

export const verifyRep = async (data, id) => {
    const { ci, firstname, lastname, contact } = data;

    if (!Number(ci) || !Number.isInteger(Number(ci)) || Number(ci) < 0) {
        return { message: "Parámetros en Cédula inválidos,solo números!" }
    }

    if (ci.length < 4) {
        return { message: "Cedula del estudiante invalida" }
    }

    if (!/^[A-Za-záéíóúñ'´ ]+$/.test(firstname)) {
        return { message: "Parámetros en Nombre inválidos" };
    }

    if (firstname.length > 30) {
        return { message: "Nombres muy largos maximo 30 caracteres" };
    }

    if (!/^[A-Za-záéíóúñ'´ ]+$/.test(lastname)) {
        return { message: "Parámetros en Apellido inválidos" };
    }

    if (lastname.length > 30) {
        return { message: "Apellidos muy largos maximo 30 caracteres" };
    }


    if (contact) {
        const emails = contact.emails
        const phones = contact.phone_numbers
        const invalidsEmails = emails.filter((el) => !validateEmail(el))
        const invalidsPhones = phones.filter((el) => !validateNumber(el))
        //const invalidsPhones = phones.filter
        //Validation
        if (invalidsEmails.length > 0) return { message: 'Email/s de representante invalido' }
        if (invalidsPhones.length > 0) return { message: 'Telefono/s de representante invalido' }
        if(contact.address_1 && contact.address_1.length > 150) return {message: 'La direccion debe de tener maximo 150 caracteres!'}
        if(contact.address_2 && contact.address_2.length > 150) return {message: 'La direccion debe de tener maximo 150 caracteres!'}
    }
    const repFound = await representative.findOne({ ci: ci });
    if (repFound && id == repFound.id) return true
    if (repFound) return { message: 'El representante tiene una cedula ya registrada' }
    return true
}