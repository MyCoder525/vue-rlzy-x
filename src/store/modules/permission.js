// 引入静态路由表
import { asyncRouter, constantRoutes } from '@/router'
const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}
const mutations = {
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 动态路由
  fiterRoutes(context, menus) {
    const resRoutes = asyncRouter.filter(item => {
      return menus.includes(item.name)
    })
    context.commit('setRoutes', resRoutes) // 将动态路由提交给mutations
    return resRoutes
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
