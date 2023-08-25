import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/components",
    name: "components",
    component: () =>
      import(/* webpackChunkName: "components" */ "@/views/ComponentsView.vue"),
    children: [
      {
        path: "/components/button",
        component: () =>
          import(
            /* webpackChunkName: "components" */ "@/views/ui/ButtonsView.vue"
          ),
      },
      {
        path: "/components/alert",
        component: () =>
          import(/* webpackChunkName: "alert" */ "@/views/ui/AlertsView.vue"),
      },
      {
        path: "/components/notification",
        component: () =>
          import(
            /* webpackChunkName: "notification" */ "@/views/ui/NotificationsView.vue"
          ),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "active_exact",
});

export default router;
