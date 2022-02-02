import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login/index.vue"),
  },
  {
    path: '/search',
    name: 'search',
    component: () => import("../views/search/index.vue")
  },
  {
    path: '/article/:articleId',  // 动态路由
    name: 'article',
    component: () => import("../views/article/index.vue"),
    props: true
  },
  {
    path: "/",
    name: "layout",
    component: () => import("../views/layout/index.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("../views/home/index.vue"),
      },
      {
        path: "/qa",
        name: "qa",
        component: () => import("../views/qa/index.vue"),
      },
      {
        path: "/video",
        name: "video",
        component: () => import("../views/video/index.vue"),
      },
      {
        path: "/my",
        name: "my",
        component: () => import("../views/my/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
export default router

