<template>
  <div class="projects">
    <div class="header">
      <h1>Projects</h1>
      <button @click="showModal = true" class="create-project header-desk">
        Create Project
      </button>
    </div>
    <div style="overflow-x: auto">
      <div class="controls">
        <input v-model="search" placeholder="Search by name..." />
        <select v-model="filterStatus">
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
      <ProjectTable
        :search="search"
        :filterStatus="filterStatus"
        :projects="projects"
      />
    </div>
    <ProjectModal
      :showModal="showModal"
      :projects="projects"
      @update:projects="updateProjects"
      @update:showModal="showModal = $event"
    />
    <div
      class="footer footer-mob"
      style="justify-content: center; margin-top: 20px"
    >
      <button
        @click="showModal = true"
        class="create-project"
        style="width: 100%"
      >
        Create Project
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectsStore } from "@/stores/projectsStore";
import { ref, onMounted } from "vue";
import axios from "axios";
import ProjectTable from "@/components/ProjectTable.vue";
import ProjectModal from "@/components/ProjectModal.vue";

export interface Project {
  id: number;
  name: string;
  description: string;
  tasks: number;
  status: string;
  created: string;
}

const projectsStore = useProjectsStore();
const projects = ref<Project[]>([]);
const search = ref("");
const filterStatus = ref("");
const showModal = ref(false);

const loadProjects = async () => {
  const response = await axios.get("http://localhost:5000/projects");
  projects.value = response.data;
  projectsStore.projects = response.data
  projectsStore.syncWithLocalStorage();
};

const updateProjects = (updatedProjects: Project[]) => {
  projects.value = updatedProjects;
};

onMounted(() => {
  if (projectsStore.projects.length === 0) {
    loadProjects();
  }
  projects.value = projectsStore.projects;
});
</script>

<style scoped lang="scss">
@use "../assets/styles/projects.scss" as *;
</style>
