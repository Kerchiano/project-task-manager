import { defineStore } from "pinia";
import { ref } from "vue";
import type { Project } from "@/views/Projects.vue";

export const useProjectsStore = defineStore("projects", () => {
  const projects = ref<Project[]>(
    JSON.parse(localStorage.getItem("projects") || "[]")
  );

  const syncWithLocalStorage = () => {
    localStorage.setItem("projects", JSON.stringify(projects.value));
  };

  const addProject = (project: Project) => {
    projects.value.push(project);
    syncWithLocalStorage();
  };

  const updateProjectTaskCount = (projectId: number, newCount: number) => {
    const index = projects.value.findIndex(
      (project) => project.id == projectId
    );
    if (index !== -1) {
      projects.value[index] = {
        ...projects.value[index],
        tasks: newCount,
      };
      syncWithLocalStorage();
    }
  };

  return {
    projects,
    addProject,
    syncWithLocalStorage,
    updateProjectTaskCount,
  };
});
