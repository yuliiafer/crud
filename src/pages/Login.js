import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useContext } from "react";
import axios from "axios";
import { BASE_URL, AUTH_PATH } from "../utils/constants";
import { loginSchema } from "../utils/schema";
import AuthContext from "../context/AuthContext";
import { useHistory } from "react-router-dom";

export default function Login() {
  const history = useHistory();
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [, setAuth] = useContext(AuthContext);
  const [success, setSuccess] = useState(null);
  const { register, handleSubmit, errors } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setLoginError(null);

    console.log(data);

    try {
      const response = await axios.post(`${BASE_URL}${AUTH_PATH}`, data);
      console.log("response", response.data);
      setAuth(response.data);
      setSuccess(true);
      if (response) {
        history.push("./products");
      }
    } catch (error) {
      console.log("error", error);
      setLoginError(error.toString());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={submitting}>
          {loginError && (
            <p className="error">Incorrect username or password</p>
          )}
          <div>
            {success ? (
              <p className="success">You logged successfully!</p>
            ) : null}
          </div>
          <div>
            <input name="identifier" placeholder="Username *" ref={register} />
            {errors.identifier && <p>{errors.identifier.message}</p>}
          </div>

          <div>
            <input
              name="password"
              placeholder="Password *"
              ref={register}
              type="current-password"
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <button type="submit">{submitting ? "Loggin in..." : "Login"}</button>
        </fieldset>
      </form>
    </>
  );
}
