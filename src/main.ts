import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import "./assets/styles/main.scss";

const app = createApp(App);

app.use(Toast);

app.use(router);
app.use(VueQueryPlugin);
app.use(createPinia());
app.mount("#app");
