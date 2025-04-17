// import { type RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/RF4/DataTabsView.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
