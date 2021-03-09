import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useContext } from "react";
import axios from "axios";
import { BASE_URL, AUTH_PATH } from "../utils/constants";
import { loginSchema } from "../utils/schema";
import AuthContext from "../context/AuthContext";

export default function Login() {
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [, setAuth] = useContext(AuthContext);

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
    } catch (error) {
      console.log("error", error);
      setLoginError(error.toString());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {loginError && <p>{loginError}</p>}
        <fieldset disabled={submitting}>
          <div>
            <input name="identifier" placeholder="Username" ref={register} />
            {errors.identifier && <p>{errors.identifier.message}</p>}
          </div>

          <div>
            <input
              name="password"
              placeholder="Password"
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
