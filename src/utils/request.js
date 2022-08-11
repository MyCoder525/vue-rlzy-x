import router from "@/router";
import store from "@/store";
import axios from "axios";
import { Message } from "element-ui";
import { getTime } from "./auth";

const resquest = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
});
const timeOut = 100000000000000;
function DateTime() {
  return Date.now() - getTime() < timeOut;
}
resquest.interceptors.request.use(
  (config) => {
    const token = store.getters.token;
    if (token) {
      if (DateTime()) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        Message.error("登陆失效，请重新登陆");
        store.dispatch("user/logout");
        router.push("/");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
resquest.interceptors.response.use(
  (response) => {
    const {
      data: { success, data, message },
    } = response;
    if (success) {
      return data;
    }
    Message.error(message || "发生错误");
    return Promise.reject(message || "发生错误");
  },
  (error) => {
    console.dir(error);
    if (error.response.status === 401) {
      store.dispatch("user/logout");
      router.push("/login");
    }
    Message.error(error.response?.data?.message || "错误");
    return Promise.reject(error);
  }
);
export default resquest;
