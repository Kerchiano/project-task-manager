<template>
  <table class="project-table">
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
            <div class="triangle-block">
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
    <tbody>
      <tr
        v-for="project in filteredProjects"
        :key="project.id"
        @click="goToProject(project.id)"
      >
        <td>
          <div>{{ project.id }}</div>
        </td>
        <td>{{ project.name }}</td>
        <td>{{ project.tasks }}</td>
        <td>
          <span :class="['status', project.status.toLowerCase()]">
            {{ project.status }}
          </span>
        </td>
        <td>{{ project.created }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

interface Column {
  key: string;
  label: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  tasks: number;
  status: string;
  created: string;
}

const { search, filterStatus, projects } = defineProps<{
  search: string;
  filterStatus: string;
  projects: Project[];
}>();

const columns: Column[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "tasks", label: "Tasks" },
  { key: "status", label: "Status" },
  { key: "created", label: "Created" },
];

const sortKey = ref("id");
const sortAsc = ref(true);
const router = useRouter();
const columnWidths = ref<number[]>(columns.map(() => 150));
let startX = 0;
let startLeftWidth = 0;
let startRightWidth = 0;
let colIndex: number | null = null;

const sortBy = (key: string, asc: boolean) => {
  if (sortKey.value === key && sortAsc.value === asc) {
    return;
  }
  sortKey.value = key;
  sortAsc.value = asc;
};

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

const goToProject = (id: number) => {
  router.push(`/projects/${id}`);
};

const filteredProjects = computed(() => {
  return projects
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) &&
        (filterStatus === "" || p.status === filterStatus)
    )
    .sort((a, b) => {
      const aVal = (a as any)[sortKey.value];
      const bVal = (b as any)[sortKey.value];
      return sortAsc.value ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });
});
</script>

<style scoped lang="scss">
@use '../assets/styles/projectTable.scss' as *;
</style>
