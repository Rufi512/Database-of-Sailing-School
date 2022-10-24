import React, { useState,useRef } from "react";
import { useNavigate } from "react-router";
import {Link} from 'react-router-dom'
import { ReactComponent as PersonIcon } from "../static/icons/person.svg";
import { ReactComponent as EmailIcon } from "../static/icons/email.svg";
import { ReactComponent as QuestionsIcon } from "../static/icons/forgot/questions.svg";
import "../static/styles/form-forgot.css";
import { toast } from "react-toastify";
import { forgotPasswordQuestions, forgotPasswordEmail } from "../API";
import ReCAPTCHA from "react-google-recaptcha";
const ForgotPassword = () => {
	const [user, setUser] = useState({ user: "", option: 0 });
	const [isSubmit, setIsSubmit] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	let navigate = useNavigate();
	const recaptchaRef = useRef(null)
	const submit = async (e) => {
		e.preventDefault();
		if(isSubmit) return
		setIsSubmit(true);
		const toastId = toast.loading("Verificando datos...");
		if(user.option === 0){
			recaptchaRef.current.reset()
			toast.update(toastId, {
						render: 'Debes de seleccionar una opcion para continuar!',
						type: "error",
						isLoading: false,
						closeOnClick: true,
						autoClose: 5000,
					});
			setIsSubmit(false);
		}
		let res;
		try {
			if (user.option === 1) {
				//Send email recovery password
				res = await forgotPasswordEmail(user);
				recaptchaRef.current.reset()
				if (res.status >= 400) {
					setIsSubmit(false);
					return toast.update(toastId, {
						render: res.data.message,
						type: "error",
						isLoading: false,
						closeOnClick: true,
						autoClose: 5000,
					});
				} else {
					
					toast.update(toastId, {
						render: "Email Enviado",
						type: "success",
						isLoading: false,
						closeOnClick: true,
						autoClose: 5000,
					});
					setEmailSent(true);
				}
			}
			if (user.option === 2) {
				res = await forgotPasswordQuestions(user);
				recaptchaRef.current.reset()
				if (res.status >= 400) {
					setIsSubmit(false);
					return toast.update(toastId, {
						render: res.data.message,
						type: "error",
						isLoading: false,
						closeOnClick: true,
						autoClose: 5000,
					});
				} else {
					toast.update(toastId, {
						render: "",
						type: "success",
						isLoading: false,
						closeOnClick: true,
						autoClose: 1,
					});
					navigate("/reset-password/questions/", { state:{questions:res.data,user:user.user} });
				}
			}
		} catch (e) {
			setIsSubmit(false);
		}
	};

	const onCaptcha = async (value) => {
    if (value) {
      setUser({ ...user, recaptcha: value });
    } else {
      setUser({ ...user, recaptcha: "" });
    }
  };

	const goLogin = (e) => {
		navigate("/");
	};

	// If option is default

	return (
		<>
			{
				// If option is send email
				<div
					className={`email-confirm ${
						user.option === 1 && emailSent === true
							? "email-confirm-fade"
							: ""
					}`}
				>
					{" "}
					<h1>Correo de recuperacion enviado!</h1>{" "}
					<p>
						Hemos enviado un link en el que podras recuperar tu
						contraseña! ve y revisa tu correo por favor, tienes 15
						minutos antes del que correo enviado sea invalido para
						la recuperacion{" "}
					</p>
					<Link to="/" className="btn btn-primary">Volver al inicio</Link>
				</div>
			}
			<div
				className={`container-forgot ${
					user.option === 1 && emailSent === true
						? "fade-container-form"
						: ""
				}`}
			>
				<h1 className="title">Recuperacion de contraseña</h1>
				<p className="text">
					Para recuperar la contraseña sigue los pasos a continuacion
				</p>

				<form className="form form-forgot" onSubmit={submit}>
					<label className="field">
						<p className="label">1. Cedula o Correo electronico</p>
						<div className="field-content">
							<div className="icon">
								<PersonIcon fill={"#19429f"} />
							</div>
							<input
								type="text"
								placeholder="Introduce tu cedula o correo"
								onInput={(e) => {
									setUser({ ...user, user: e.target.value });
								}}
							/>
						</div>
					</label>

					<p className="label">2. Elige un metodo de recuperacion</p>

					<div className="container-options">
						<div
							className={`card-option ${
								user.option === 1 ? "card-option-selected" : ""
							}`}
							onClick={(e) => {
								setUser({ ...user, option: 1 });
							}}
						>
							<EmailIcon fill={"#19429f"} />
							<div className="content">
								<h2>Recuperar mediante correo electronico</h2>
								<p>
									Se le enviara un correo electronico con un
									enlace para cambiar su contraseña
								</p>
							</div>
						</div>

						<div
							className={`card-option ${
								user.option === 2 ? "card-option-selected" : ""
							}`}
							onClick={(e) => {
								setUser({ ...user, option: 2 });
							}}
						>
							<QuestionsIcon fill={"#19429f"} />
							<div className="content">
								<h2>
									Recuperar mediante preguntas de seguridad
								</h2>
								<p>
									Si cuenta con preguntas de seguridad, puedes
									intentar recuperar la contraseña por este
									metodo
								</p>
							</div>
						</div>
					</div>
					<div className="captcha_container">
						<ReCAPTCHA
							ref={recaptchaRef}
							sitekey="6Lf0i_seAAAAADa-22kcxr_u8f2AXw3zIP_vf-aa"
							onChange={onCaptcha}
						/>
					</div>
					<div className="container-buttons">
						<button
							className="button-submit"
							type="button"
							onClick={(e) => {
								goLogin();
							}}
						>
							Regresar
						</button>
						<button className="button-submit" type="submit">
							Continuar
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default ForgotPassword;