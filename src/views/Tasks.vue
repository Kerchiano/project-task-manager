<template>
  <div class="tasks">
    <div class="header">
      <router-link to="/" class="back-arrow">← Назад</router-link>
      <h1>Tasks</h1>
      <button @click="showModal = true" class="add-task header-desk">
        Add Task
      </button>
    </div>
    <div style="overflow-x: auto">
      <div class="controls">
        <div>
          <input
            v-model="search"
            placeholder="Search by name..."
            style="margin-right: 10px"
          />
          <select v-model="filterStatus">
            <option value="">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div class="change_status">
          <div
            class="status-drop"
            v-for="status in ['To Do', 'In Progress', 'Done']"
            :key="status"
            draggable="true"
            @dragstart="handleStatusDragStart(status, $event)"
          >
            {{ status }}
          </div>
        </div>
      </div>

      <table class="task-table">
        <thead>
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="column.key"
              :ref="'col_' + index"
              :style="{ width: columnWidths[index] + 'px' }"
            >
              <div class="block-col">
                <span>{{ column.label }}</span>
                <div
                  class="triangle-block"
                  v-if="column.key === 'dueDate' || column.key === 'status'"
                >
                  <div
                    class="triangle-up"
                    :class="{ active: sortKey === column.key && sortAsc }"
                    @click="sortBy(column.key, true)"
                  ></div>
                  <div
                    class="triangle-down"
                    :class="{ active: sortKey === column.key && !sortAsc }"
                    @click="sortBy(column.key, false)"
                  ></div>
                </div>
              </div>
              <div
                v-if="index < columns.length - 1"
                class="resizer"
                @mousedown="startResize($event, index)"
              ></div>
            </th>
          </tr>
        </thead>
        <Draggable
          is="draggable"
          v-model="tasks"
          tag="tbody"
          item-key="id"
          @end="onDragEnd"
        >
          <template v-slot:item="slotProps">
            <template v-if="filteredTasks.includes(slotProps.element)">
              <tr
                draggable="true"
                @dragover.prevent
                @drop="handleStatusDrop(slotProps.element)"
                @dblclick="editTask(slotProps.element)"
              >
                <td>{{ slotProps.element.id }}</td>
                <td>{{ slotProps.element.title }}</td>
                <td>{{ slotProps.element.assignee }}</td>
                <td>
                  <span
                    :class="['status', slotProps.element.status.toLowerCase()]"
                  >
                    {{ slotProps.element.status }}
                  </span>
                </td>
                <td>{{ slotProps.element.dueDate }}</td>
              </tr>
            </template>
          </template>
        </Draggable>
      </table>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal__content">
        <h2 class="modal__title">Add Task</h2>
        <form @submit.prevent="createTask" class="modal__form">
          <label class="form__label">Title</label>
          <input v-model="newTask.title" class="form__input" required />

          <label class="form__label">Assignee</label>
          <select v-model="newTask.assignee" class="form__input" required>
            <option disabled value="">Select assignee</option>
            <option
              v-for="(user, index) in uniqueAssignees"
              :key="index"
              :value="user"
            >
              {{ user }}
            </option>
          </select>

          <label class="form__label">Status</label>
          <select v-model="newTask.status" class="form__input" required>
            <option disabled value="">Select status</option>
            <option value="To do">To do</option>
            <option value="In progress">In progress</option>
            <option value="Done">Done</option>
          </select>

          <label class="form__label">Due Date</label>
          <input
            type="date"
            v-model="newTask.dueDate"
            class="form__input"
            required
          />

          <div class="form__buttons">
            <button
              type="button"
              class="btn btn--cancel"
              @click="showModal = false"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn--save">Save</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showEditModal" class="modal">
      <div class="modal__content">
        <h2 class="modal__title">Edit Task</h2>
        <form @submit.prevent="updateTask" class="modal__form">
          <label class="form__label">Title</label>
          <input v-model="editableTask.title" class="form__input" required />

          <label class="form__label">Assignee</label>
          <select v-model="editableTask.assignee" class="form__input" required>
            <option disabled value="editableTask.status">
              Select assignee
            </option>
            <option disabled value="">Select status</option>
            <option
              v-for="(user, index) in uniqueAssignees"
              :key="index"
              :value="user"
            >
              {{ user }}
            </option>
          </select>

          <label class="form__label">Status</label>
          <select v-model="editableTask.status" class="form__input" required>
            <option disabled value="">Select status</option>
            <option value="To do">To do</option>
            <option value="In progress">In progress</option>
            <option value="Done">Done</option>
          </select>

          <label class="form__label">Due Date</label>
          <input
            type="date"
            v-model="editableTask.dueDate"
            class="form__input"
            required
          />

          <div class="form__buttons">
            <button
              type="button"
              class="btn btn--cancel"
              @click="showEditModal = false"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn--save">Update</button>
          </div>
        </form>
      </div>
    </div>
    <div
      class="footer footer-mob"
      style="justify-content: center; margin-top: 20px"
    >
      <button @click="showModal = true" class="add-task" style="width: 100%">
        Add Task
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import Draggable from "vuedraggable";
import { useTasksStore } from "@/stores/tasksStore";
import { useProjectsStore } from "@/stores/projectsStore";
import { useToast } from "vue-toastification";

const toast = useToast();
const route = useRoute();
const rawProjectId = route.params.id;
const projectId = Array.isArray(rawProjectId)
  ? parseInt(rawProjectId[0])
  : parseInt(rawProjectId);
const projectsStore = useProjectsStore();
const tasksStore = useTasksStore();
const hasProjectTasks = !!tasksStore.tasks[projectId]?.length;

export interface Task {
  id: number;
  title: string;
  assignee: string;
  status: string;
  dueDate: string;
  projectId: number;
  order: number;
}

interface Column {
  key: string;
  label: string;
}

const columns: Column[] = [
  { key: "id", label: "ID" },
  { key: "title", label: "Title" },
  { key: "assignee", label: "Assignee" },
  { key: "status", label: "Status" },
  { key: "dueDate", label: "Due Date" },
];

const tasks = ref<Task[]>([]);
const search = ref("");
const filterStatus = ref("");
const showModal = ref(false);

const loadTasks = async () => {
  const response = await axios.get(
    `http://localhost:5000/tasks/?projectId=${projectId}`
  );
  tasksStore.tasks = { ...tasksStore.tasks, [projectId]: response.data };
  tasksStore.syncWithLocalStorage();
  tasks.value = response.data.sort((a: Task, b: Task) => a.order - b.order);
};

const sortKey = ref("");
const sortAsc = ref(true);

const filteredTasks = computed(() => {
  return tasks.value.filter(
    (task) =>
      task.assignee.toLowerCase().includes(search.value.toLowerCase()) &&
      (filterStatus.value === "" || task.status === filterStatus.value)
  );
});

watch([sortKey, sortAsc], () => {
  tasks.value.sort((a, b) => {
    const aVal = (a as any)[sortKey.value];
    const bVal = (b as any)[sortKey.value];

    const isStatus = sortKey.value === "status";
    const asc = isStatus ? !sortAsc.value : sortAsc.value;

    if (aVal === bVal) return 0;
    return asc ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
  });
});

const onDragEnd = async () => {
  const oldOrders = tasksStore.tasks[projectId]
    .map((t) => t.order)
    .sort((a, b) => a - b);
  const updatedTasks = tasks.value.map((task, index) => ({
    ...task,
    order: oldOrders[index],
  }));
  tasksStore.tasks[projectId] = updatedTasks;
  tasksStore.syncWithLocalStorage();

  try {
    await axios.post("http://localhost:5000/batch-tasks", updatedTasks);
    console.log("Tasks reordered successfully");
  } catch (err) {
    console.error("Failed to reorder tasks:", err);
  }
};

const draggedStatus = ref<string | null>(null);

const handleStatusDragStart = (status: string, e: DragEvent) => {
  draggedStatus.value = status;
  e.dataTransfer?.setData("text/plain", status);
  console.log("Dragging status:", status);
};

const handleStatusDrop = async (task: Task) => {
  if (!draggedStatus.value || task.status === draggedStatus.value) return;

  console.log(`Changing status of "${task.title}" to ${draggedStatus.value}`);

  await axios.patch(`http://localhost:5000/tasks/${task.id}`, {
    status: draggedStatus.value,
  });

  await loadTasks();
  toast.success("Статус завдання успішно оновлено!");
  draggedStatus.value = null;
};

const sortBy = (key: string, asc: boolean) => {
  if (sortKey.value === key && sortAsc.value === asc) {
    return;
  }
  sortKey.value = key;
  sortAsc.value = asc;
};

onMounted(() => {
  if (!hasProjectTasks) {
    loadTasks();
  } else {
    tasks.value = tasksStore
      .getTasksByProjectId(projectId)
      .sort((a: Task, b: Task) => a.order - b.order);
  }
});

const defaultAssignees = ["Alice", "Bob", "Charlie", "David", "Eve"];

const uniqueAssignees = computed(() => {
  const taskNames = tasks.value.map((t) => t.assignee).filter(Boolean);

  return [...new Set([...defaultAssignees, ...taskNames])];
});

const newTask = ref({
  title: "",
  assignee: "",
  status: "",
  dueDate: "",
  projectId: projectId,
  order: Date.now(),
});

const createTask = async () => {
  try {
    await axios.post("http://localhost:5000/tasks", newTask.value);

    const currentProject = projectsStore.projects.find(
      (project) => project.id == projectId
    );

    if (!currentProject) {
      throw new Error(`Проект с ID ${projectId} не найден`);
    }

    const updatedTasksCount = currentProject.tasks + 1;

    await axios.patch(`http://localhost:5000/projects/${projectId}`, {
      tasks: updatedTasksCount,
    });

    projectsStore.updateProjectTaskCount(projectId, updatedTasksCount);

    showModal.value = false;
    await loadTasks();
    toast.success("Завдання успішно створено!");

    newTask.value = {
      title: "",
      assignee: "",
      status: "",
      dueDate: "",
      projectId: projectId,
      order: Date.now(),
    };
  } catch (err) {
    console.error("Помилка при створенні завдання:", err);
  }
};

const showEditModal = ref(false);
const editableTask = ref<Task>({
  id: 0,
  title: "",
  assignee: "",
  status: "",
  dueDate: "",
  projectId: Number(projectId),
  order: 0,
});

const editTask = (task: Task) => {
  const storedTask = tasksStore
    .getTasksByProjectId(task.projectId)
    .find((t) => t.id === task.id);
  editableTask.value = {
    ...task,
    order: storedTask?.order ?? 0,
  };
  showEditModal.value = true;
};

const updateTask = async () => {
  try {
    await axios.put(
      `http://localhost:5000/tasks/${editableTask.value.id}`,
      editableTask.value
    );
    tasksStore.updateTask(editableTask.value);
    tasks.value = tasksStore
      .getTasksByProjectId(editableTask.value.projectId)
      .sort((a, b) => a.order - b.order);
    showEditModal.value = false;
    toast.success("Завдання успішно оновлено");
  } catch (err) {
    console.error("Ошибка при обновлении задачи:", err);
  }
};

const columnWidths = ref<number[]>(columns.map(() => 150));
let startX = 0;
let startLeftWidth = 0;
let startRightWidth = 0;
let colIndex: number | null = null;

const startResize = (e: MouseEvent, index: number) => {
  if (index >= columnWidths.value.length - 1) return;

  startX = e.clientX;
  colIndex = index;
  startLeftWidth = columnWidths.value[index];
  startRightWidth = columnWidths.value[index + 1];

  document.addEventListener("mousemove", resizeColumn);
  document.addEventListener("mouseup", stopResize);
};

const resizeColumn = (e: MouseEvent) => {
  if (colIndex === null) return;

  const dx = e.clientX - startX;
  const newLeft = Math.max(startLeftWidth + dx, 50);
  const newRight = Math.max(startRightWidth - dx, 50);

  if (newRight <= 50 && dx > 0) return;

  columnWidths.value[colIndex] = newLeft;
  columnWidths.value[colIndex + 1] = newRight;
};

const stopResize = () => {
  document.removeEventListener("mousemove", resizeColumn);
  document.removeEventListener("mouseup", stopResize);
  colIndex = null;
};
</script>

<style scoped lang="scss">
@use "../assets/styles/tasks" as *;
</style>
