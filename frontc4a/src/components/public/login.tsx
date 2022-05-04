import { SetStateAction, useContext, useState } from "react";
import "./login.css";

import { IUser, User } from "../models/User";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserService from "../services/User.Service";
import { AuthContext, IAuthContext } from "../context/AuthContext";
// iport { sha256 } from 'js-sha256';

const Login = () => {
  const { login } = useContext(AuthContext) as IAuthContext;
  const [email, setEmail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  var CryptoJS = require("crypto-js");

  const onChangeEmail = (event: {
    target: { value: SetStateAction<string> };
  }) => setEmail(event.target.value);
  const onChangePwd = (event: { target: { value: SetStateAction<string> } }) =>
    setPwd(event.target.value);

  const iniciarSesion = async () => {
    if (email && pwd) {
      var encryptedAES = CryptoJS.AES.encrypt(pwd, "cfa");
      const data = {
        pwd: encryptedAES.toString(),
        email: email,
      };
      try {
        setLoading(true);
        const promise = UserService.login(data).then((response) => {
          if (response === "Credenciales Incorrectas") {
            console.log(response);
            toast.error("Error al intentar ingresar, revise sus credenciales");
          } else {
            login(response.user, response.token);            
            toast.success("Bienvenid@ "+response.user.nombre);
            navigate("/");
          }
        });

        toast.promise(promise, {
          pending: "Espere por favor..",
          error: "Revise sus datos de acceso",
        });
      } catch (e) {
        toast.error("Error al intentar ingresar");
        console.log(e);
      } finally {
        setLoading(false);
      }
    } else {
    }
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <div className="login100-form validate-form">
            <h1
              style={{
                marginBottom: "20px",
                textAlign: "center",
                color: "#075ac1",
              }}
            >
              Coffee4All
            </h1>
            <span
              className="login100-form-title p-b-43"
              style={{ marginBottom: "15px" }}
            >
              Iniciar Sesi&oacute;n
            </span>
            <div className="wrap-input100 validate-input">
              <input
                className="input100"
                type="email"
                value={email}
                onChange={onChangeEmail}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    iniciarSesion();
                  }
                }}
              />
              <span className="focus-input100" />
              <span className="label-input100">E-mail</span>
            </div>
            <div
              className="wrap-input100 validate-input sm"
              data-validate="Password is required"
            >
              <input
                className="input100"
                type="password"
                value={pwd}
                onChange={onChangePwd}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    iniciarSesion();
                  }
                }}
              />
              <span className="focus-input100" />
              <span className="label-input100 p-b-43">Contraseña</span>
            </div>
            <div className="container-login100-form-btn">
              <button
                id="btnEntrar"
                className="login100-form-btn"
                onClick={iniciarSesion}
              >
                Entrar
              </button>
            </div>
          </div>

          <div
            className="login100-more"
            style={{ backgroundImage: 'url("/login.jpg")' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
