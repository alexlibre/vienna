import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { registerLayouts } from "./layouts/register";

import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

import "./assets/styles/main.css";

const app = createApp(App);
app.use(router);

app.use(pinia);
registerLayouts(app);
app.mount("#app");
