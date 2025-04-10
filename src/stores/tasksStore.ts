import { defineStore } from "pinia";
import { ref } from "vue";
import type { Task } from "@/views/Tasks.vue";

type TasksByProject = {
  [projectId: string]: Task[];
};

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref<TasksByProject>(
    JSON.parse(localStorage.getItem("tasks") || "{}")
  );

  const addTask = (task: Task) => {
    const projectId = task.projectId.toString();
    if (!tasks.value[projectId]) {
      tasks.value[projectId] = [];
    }
    tasks.value[projectId].push(task);
    syncWithLocalStorage();
  };

  const updateTask = (updatedTask: Task) => {
    const projectIdStr = updatedTask.projectId.toString();
    const projectTasks = tasks.value[projectIdStr];

    if (!projectTasks) return;

    const taskIndex = projectTasks.findIndex((t) => t.id === updatedTask.id);

    if (taskIndex !== -1) {
      const originalOrder = projectTasks[taskIndex].order;

      projectTasks[taskIndex] = {
        ...updatedTask,
        order: updatedTask.order ?? originalOrder,
      };

      syncWithLocalStorage();
    }
  };

  const getTasksByProjectId = (projectId: number | string): Task[] => {
    return tasks.value[projectId.toString()] || [];
  };

  const syncWithLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks.value));
  };

  return {
    tasks,
    addTask,
    updateTask,
    getTasksByProjectId,
    syncWithLocalStorage,
  };
});
