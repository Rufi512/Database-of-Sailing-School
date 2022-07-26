import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";
import {Link} from 'react-router-dom'
import "../static/styles/form-reset.css";
import { forgotLinkQuestions } from "../API";
const Questions = (props) => {
  const data = useLocation();
  let navigate = useNavigate();
  const [user,setUser] = useState("")
  const [questions,setQuestions] = useState([])
  const [answers, setAnswers] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false)
  const [sendEmail,setSendEmail] = useState(false)
  useEffect(() => {
    setQuestions(data.state.questions);
    setUser(data.state.user)
  }, [data]);
  console.log(data)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!isSubmit) setIsSubmit(true)
    const toastId = toast.loading("Verificando datos...");
     try {
      let res = await forgotLinkQuestions({user:user,answers:answers})
      setIsSubmit(false)
      if(res.status >= 400){
        return toast.update(toastId, {
        render: res.data.message,
        type: "error",
        isLoading: false,
        closeOnClick: true,
        autoClose: 5000,
      });
      }

    } catch(e) {
      setIsSubmit(false)
      console.log(e)
    }

    toast.update(toastId, {
        render: "",
        type: "success",
        isLoading: false,
        closeOnClick: true,
        autoClose: 1,
      });
    setSendEmail(true)
  };
  return (
    <>
    {
        // If option is send email
        <div
          className={`email-confirm ${sendEmail ? "email-confirm-fade" : ""}`}>
          {" "}
          <h1>Correo de recuperacion enviado!</h1>{" "}
          <p>
            Hemos enviado un link en el que podras recuperar tu contraseña! ve y
            revisa tu correo por favor, tienes 15 minutos antes del que correo
            enviado sea invalido para la recuperacion{" "}
          </p>
          <Link to="/" className="btn btn-primary">Volver al inicio</Link>
        </div>
      }
    <div className={`container-user-reset ${sendEmail ? "fade-container-form" : ''}`}>
      <h2>Contesta las preguntas para continuar</h2>
      <form className="form" onSubmit={handleSubmit}>
        {questions.map((el, i) => (
          <label className="field" key={i}>
            <p>
              Pregunta {i+1}: {el.question}
            </p>
            <div className="field-content">
              <input
                type="text"
                placeholder="Escribe tu respuesta"
                onInput={(e) => {
                  let items = [...answers];
                  let item = { ...answers[i] };
                  item = e.target.value;
                  items[i] = item;
                  setAnswers(items);
                }}
              />
            </div>
          </label>
        ))}
        <div className="container-buttons">
          <button
            type="button"
            className="button-submit"
            onClick={(e) => {
              navigate("/forgot-password");
            }}
          >
            Regresar
          </button>
          <button type="submit" className="button-submit">
            Confirmar
          </button>
        </div>
      </form>
    </div>
  </>
  );
};

export default Questions;