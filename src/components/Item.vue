<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
type State = "idle" | "dragging" | "over";

const props = defineProps<{
  item: number;
}>();

const state = ref<State>("idle");
const itemRef = useTemplateRef<HTMLElement>("itemRef");

onMounted(() => {
  if (!itemRef.value) return;

  combine(
    draggable({
      element: itemRef.value,
      getInitialData: () => ({ item: props.item }),
      onDragStart: () => (state.value = "dragging"),
      onDrop: () => (state.value = "idle"),
    }),
    dropTargetForElements({
      element: itemRef.value,
      getData: () => ({ item: props.item }),
      getIsSticky: () => true,
      canDrop: ({ source }) => source.data.item !== props.item,
      onDragEnter: () => (state.value = "over"),
      onDragLeave: () => (state.value = "idle"),
      onDrop: () => (state.value = "idle"),
    })
  );
});
</script>

<template>
  <div
    class="grid-item"
    ref="itemRef"
    :class="{
      'item-idle': state === 'idle',
      'item-dragging': state === 'dragging',
      'item-over': state === 'over',
    }"
  >
    {{ props.item }}
  </div>
</template>

<style scoped>
.grid-item {
  background-color: #f0f0f0;
  padding: 20px;
  text-align: center;
  color: #333;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: none;
  transition: all 200ms ease-in-out;
  -webkit-touch-callout: none;
}

.item-idle:hover {
  background: #fcde70;
  box-shadow: 0px 8px 12px #091e4226, 0px 0px 1px #091e424f;
}

.item-dragging {
  filter: grayscale(0.3);
  background-color: #c4e1f6;
}

.item-over {
  transform: scale(1.1) rotate(8deg);
  filter: brightness(1.15);
  box-shadow: 0px 8px 12px #091e4226, 0px 0px 1px #091e424f;
  background: #73ec8b;
}
</style>
