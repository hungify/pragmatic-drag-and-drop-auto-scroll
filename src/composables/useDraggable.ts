import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import type {
  AllDragTypes,
  DropTargetGetFeedbackArgs,
  ElementDragType,
  Input,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { MaybeRefOrGetter, onMounted, ref, toValue, watchEffect } from "vue";
import { DraggableState } from "../shared";

// Lib doesn't export these types, so we need to define them ourselves
type DraggableGetFeedbackArgs = {
  /**
   * The user input as a drag is trying to start (the `initial` input)
   */
  input: Input;
  /**
   * The `draggable` element
   */
  element: HTMLElement;
  /**
   * The `dragHandle` element for the `draggable`
   */
  dragHandle: Element | null;
};
interface DraggablePreview {
  element: HTMLElement;
  bounds: DOMRect;
}

interface DraggableOffset {
  x: number;
  y: number;
}

interface DraggableOptions<TElement extends HTMLElement> {
  element: MaybeRefOrGetter<TElement | null>;
  canDrag?: (args: DraggableGetFeedbackArgs) => boolean;
  canDrop?: (args: DropTargetGetFeedbackArgs<ElementDragType>) => boolean;
  handle?: Element;
  getInitialData?: (args: DraggableGetFeedbackArgs) => Record<string, unknown>;
  getData?: (
    args: DropTargetGetFeedbackArgs<AllDragTypes>
  ) => Record<string | symbol, unknown>;
}

export const useDraggable = <TElement extends HTMLElement>(
  options: DraggableOptions<TElement>
) => {
  const state = ref<DraggableState>("idle");
  const pointer = ref<Input | null>(null);
  const offset = ref<DraggableOffset | null>(null);
  const preview = ref<DraggablePreview | null>(null);
  const previewElement = ref<HTMLElement | null>(null);

  const resetDraggable = () => {
    previewElement.value = null;
    preview.value = null;
    pointer.value = null;
    offset.value = null;
  };

  onMounted(() => {
    const element = toValue(options.element);
    if (!element) return;

    combine(
      draggable({
        element,
        getInitialData: options.getInitialData,
        canDrag: options.canDrag,
        onDragStart: ({ location }) => {
          state.value = "dragging";
          const { input } = location.current;

          const bounds = element.getBoundingClientRect();
          offset.value = {
            x: input.clientX - bounds.left,
            y: input.clientY - bounds.top,
          };
          pointer.value = input;
        },
        onDrag: ({ location }) => {
          state.value = "dragging";
          pointer.value = location.current.input;
        },
        onDrop: () => {
          state.value = "idle";
          resetDraggable();
        },
        onGenerateDragPreview: ({ source, nativeSetDragImage }) => {
          disableNativeDragPreview({ nativeSetDragImage });

          const bounds = source.element.getBoundingClientRect();
          if (!bounds) return;

          preview.value = {
            element: source.element,
            bounds,
          };
        },
      }),
      dropTargetForElements({
        element,
        canDrop: options.canDrop,
        getData: options.getData,
        onDragEnter: () => (state.value = "over"),
        onDragLeave: () => (state.value = "idle"),
        onDrop: () => (state.value = "idle"),
      })
    );
  });

  watchEffect(() => {
    if (!previewElement.value || !pointer.value || !offset.value) return;

    const x = pointer.value.clientX - offset.value.x;
    const y = pointer.value.clientY - offset.value.y;

    requestAnimationFrame(() => {
      if (!previewElement.value) return;
      previewElement.value.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  return {
    state,
    preview,
    previewElement,
  };
};
