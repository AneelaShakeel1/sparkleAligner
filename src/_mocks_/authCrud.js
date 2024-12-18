import axios from "../config/Axios";

export const LOGIN_URL = "api/auth/login";
export const REGISTER_URL = "api/auth/signup";

export function login(email, password) {
  //return axios.post(LOGIN_URL, { email, password });
  let data =
    localStorage.getItem("token") !== null
      ? JSON.parse(localStorage.getItem("token1")).token
      : "";
  return data;
}

export function register(email, name, password) {
  return axios.post(REGISTER_URL, { email, name, password });
}
