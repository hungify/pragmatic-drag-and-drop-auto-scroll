<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import Item from "./Item.vue";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";

const list = ref(new Array(100).fill(0).map((_, i) => i + 1));
const listRef = useTemplateRef("listRef");

onMounted(() => {
  if (!listRef.value) {
    return;
  }

  combine(
    autoScrollForElements({
      element: listRef.value,
    }),
    monitorForElements({
      canMonitor: () => true,
      onDrop({ source, location }) {
        const target = location.current.dropTargets[0];
        if (!target) {
          return;
        }
        const sourceItem = source.data.item as number;
        const destinationItem = target.data.item as number;

        const updated = [...list.value];
        const sourceIndex = updated.indexOf(sourceItem);
        const destinationIndex = updated.indexOf(destinationItem);

        if (sourceIndex < 0 || destinationIndex < 0) {
          return;
        }

        [updated[sourceIndex], updated[destinationIndex]] = [
          updated[destinationIndex],
          updated[sourceIndex],
        ];

        list.value = updated;
      },
    })
  );
});
</script>

<template>
  <div class="grid" ref="listRef">
    <Item v-for="item in list" :key="item" :item="item" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
}

:root {
  --elevation-surface-overlay: #fff;
  --elevation-shadow-overlay: none;
}
</style>
