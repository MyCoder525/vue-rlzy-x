import { getUserDetailById, getUserInfo, login } from "@/api/user";
import { getToken, removeToken, setTime, setToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    userInfo: {}
  };
};

const state = getDefaultState();

const mutations = {
  setToken(state, token) {
    state.token = token;
    setToken(token);
  },
  setUserInfo(state, data) {
    state.userInfo = data;
  },
  removeToken(state) {
    state.token = null;
    removeToken();
  },
  removeUserInfo(state) {
    state.userInfo = {};
  }
};

const actions = {
  async login(context, data) {
    const res = await login(data);
    setTime(Date.now());
    console.log(res);
    context.commit("setToken", res);
  },
  // 获取用户信息
  async getUserInfo(context) {
    const res = await getUserInfo();
    const baes = await getUserDetailById(res.userId);
    // console.log(res);
    // console.log(baes);
    context.commit("setUserInfo", { ...res, ...baes });
    return {
      ...res,
      ...baes
    }
  },
  // 退出登录 
  async logout({ commit }) {
    commit("removeToken");
    commit("removeUserInfo");
    resetRouter();
    commit('permission/setRoutes', [], { root: true })
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
