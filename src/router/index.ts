import { type RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/RF4/DataTabsView.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
