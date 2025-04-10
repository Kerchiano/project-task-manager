import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
      path: "/",
      name: "Projects",
      component: () => import("@/views/Projects.vue"),
    },
    {
      path: "/projects/:id",
      name: "ProjectDetail",
      component: () => import("@/views/Tasks.vue"),
      props: true,
    },
  ];


export const router = createRouter({
    history: createWebHistory(),
    routes,
  });