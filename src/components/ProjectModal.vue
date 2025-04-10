<template>
  <div v-if="showModal" class="modal">
    <div class="modal__content">
      <h2 class="modal__title">Create Project</h2>
      <form @submit.prevent="createProject" class="modal__form">
        <label class="form__label">Title</label>
        <input v-model="newProject.name" class="form__input" required />

        <label class="form__label">Description</label>
        <textarea
          v-model="newProject.description"
          class="form__textarea"
        ></textarea>

        <div class="form__buttons">
          <button type="button" class="btn btn--cancel" @click="cancel">
            Cancel
          </button>
          <button type="submit" class="btn btn--save">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useProjectsStore } from "@/stores/projectsStore";

interface Project {
  id: number;
  name: string;
  description: string;
  tasks: number;
  status: string;
  created: string;
}

const props = defineProps({
  showModal: Boolean,
  projects: {
    type: Array as () => Project[],
    required: true,
  },
});

const emit = defineEmits<{
  (e: "update:showModal", value: boolean): void;
  (e: "update:projects", projects: Project[]): void;
}>();

const projectsStore = useProjectsStore();

const newProject = ref({
  name: "",
  description: "",
});

const createProject = async () => {
  const newId = Date.now();
  const today = new Date().toISOString().split("T")[0];

  const newEntry: Project = {
    id: newId,
    name: newProject.value.name,
    description: newProject.value.description,
    tasks: 0,
    status: "Active",
    created: today,
  };

  await axios.post("http://localhost:5000/projects", newEntry);

  emit("update:projects", [...props.projects, newEntry]);

  emit("update:showModal", false);
  projectsStore.addProject(newEntry)

  newProject.value = { name: "", description: "" };
};

const cancel = () => {
  newProject.value = { name: "", description: "" };
  emit("update:showModal", false);
};
</script>

<style scoped lang="scss">
@use '../assets/styles/projectModal.scss' as *;
</style>
