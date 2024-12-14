<script setup lang="ts">
import { computed, ref } from "vue";
import { useDraggable } from "../../composables/useDraggable";
import { TItem } from "../../shared";
import ItemPreview from "../ItemPreview.vue";

const props = defineProps<{
  item: TItem;
  instanceId: Symbol;
}>();

const itemRef = ref<HTMLElement | null>(null);
const isItemPinned = computed(() => props.item.pinned);

const { state, preview, previewElement } = useDraggable({
  element: itemRef,
  getInitialData: () => ({ item: props.item, instanceId: props.instanceId }),
  getData: () => ({ item: props.item, instanceId: props.instanceId }),
  canDrag: () => !isItemPinned.value,
  canDrop: ({ source }) => {
    if (source.element === itemRef.value) return false;

    const isSameInstance = source.data.instanceId === props.instanceId;
    return !isItemPinned.value && isSameInstance;
  },
});
</script>

<template>
  <div
    class="grid-item"
    ref="itemRef"
    :class="{
      'item-idle': state === 'idle' && !isItemPinned,
      'item-dragging': state === 'dragging',
      'item-over': state === 'over',
      'not-draggable': isItemPinned,
    }"
  >
    {{ props.item.title }}
  </div>

  <teleport to="body" v-if="preview">
    <div
      ref="previewElement"
      :style="{
        position: 'fixed',
        width: `${preview.bounds.width}px`,
        height: `${preview.bounds.height}px`,
        pointerEvents: 'none',
        willChange: 'transform',
        zIndex: 1000,
        top: 0,
        left: 0,
        transform: `translate(${preview.bounds.left}px, ${preview.bounds.top}px)`,
      }"
    >
      <ItemPreview :item="props.item" />
    </div>
  </teleport>
</template>

<style scoped>
.grid-item.not-draggable {
  cursor: not-allowed;
  background-color: #d91656;
  color: #fff;
  border-color: transparent;
}

.grid-item {
  height: 40px;
  border-width: 2px;
  border-color: #6b4ce6;
  border-style: solid;
  background-color: #f4f0ff;
  border-radius: 6px;
  transition: all 150ms ease-in-out;
  padding: 4px;
  color: #ff5630;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-idle:hover {
  background: #fcde70;
}

.item-dragging {
  filter: grayscale(0.3);
  background-color: #c4e1f6;
}

.item-over {
  transform: scale(0.9) rotate(2deg);
  filter: brightness(1.15);
  box-shadow: 0px 8px 12px #091e4226, 0px 0px 1px #091e424f;
  background: #73ec8b;
}
</style>
