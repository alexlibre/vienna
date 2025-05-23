import { createApp } from "vue";
import App from "@/App.vue";
import { router } from "@/router/router";

import "@/assets/styles/main.css";

import { createPinia } from "pinia";

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);

app.mount("#app");
