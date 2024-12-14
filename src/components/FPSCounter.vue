<script setup lang="ts">
import { ref, onMounted } from "vue";

const fps = ref(0);
let frameCount = 0;
let lastTime = performance.now();

const updateFPS = () => {
  const now = performance.now();
  frameCount++;

  if (now - lastTime >= 1000) {
    fps.value = Math.round((frameCount * 1000) / (now - lastTime));
    frameCount = 0;
    lastTime = now;
  }

  requestAnimationFrame(updateFPS);
};

onMounted(() => {
  updateFPS();
});
</script>

<template>
  <div class="fps-counter">FPS: {{ fps }}</div>
</template>

<style scoped>
.fps-counter {
  font-size: 14px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
