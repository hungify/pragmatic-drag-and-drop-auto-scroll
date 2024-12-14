<template>
  <header class="header">
    <div class="actions">
      <FPSCounter />
      <div class="scroll-controls">
        <button
          class="control-btn"
          :class="{ active: scrollMode === 'window' }"
          @click="toggleScrollMode"
        >
          Mode: {{ props.scrollMode }}
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import FPSCounter from "./FPSCounter.vue";

const props = defineProps<{
  scrollMode: "window" | "list";
}>();
defineEmits<{
  "update:scrollMode": (value: "window" | "list") => void;
}>();

const scrollMode = defineModel("scrollMode", {
  type: String,
  default: "window",
});

const toggleScrollMode = () => {
  scrollMode.value = scrollMode.value === "window" ? "list" : "window";
};
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.scroll-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: #6b4ce6;
  color: 6b4ce6;
  border-color: #6b4ce6;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
</style>
