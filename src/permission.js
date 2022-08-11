import router from "@/router/index";
import store from "@/store/index";
import NProgress from "nprogress"; // 引入一份进度条插件
import "nprogress/nprogress.css"; // 引入进度条样式
const loginList = "/login";
const notF = "/404";
const whiteList = [loginList, notF];
// 前置守卫
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const token = store.getters.token;
  if (token) {
    if (!store.getters.userId) {
      const res = await store.dispatch("user/getUserInfo"); // 默认情况静态路由
      console.log(res.roles.menus);
      const routes = await store.dispatch("permission/fiterRoutes", res.roles.menus); // 动态路由
      // 进行动态路由的添加
      router.addRoutes([...routes, { path: "*", redirect: "/404", hidden: true }]);
      // 重新再进行跳转
      next(to.path)
    }
    if (to.path === loginList) {
      next("/");
    } else {
      next();
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果找到了 表示在在名单里面
      next();
    } else {
      next(loginList);
    }
  }
  NProgress.done();
});
router.afterEach(() => {
  NProgress.done();
});
