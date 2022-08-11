import Cookies from "js-cookie";

const TokenKey = "hrsass_token";
const DateTime = "time_date";
export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

export function getTime() {
  return Cookies.get(DateTime);
}

export function setTime(date) {
  return Cookies.set(DateTime, date);
}
