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
import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  element: RefObject<TElement>;
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
  const [state, setState] = useState<DraggableState>("idle");
  const [pointer, setPointer] = useState<Input | null>(null);
  const [offset, setOffset] = useState<DraggableOffset | null>(null);
  const [preview, setPreview] = useState<DraggablePreview | null>(null);
  const previewElement = useRef<HTMLElement | null>(null);

  const resetDraggable = useCallback(() => {
    previewElement.current = null;
    setPreview(null);
    setPointer(null);
    setOffset(null);
  }, []);

  useEffect(() => {
    const element = options.element.current;
    if (!element) return;

    const cleanup = combine(
      draggable({
        element,
        getInitialData: options.getInitialData,
        canDrag: options.canDrag,
        onDragStart: ({ location }) => {
          setState("dragging");
          const { input } = location.current;

          const bounds = element.getBoundingClientRect();
          setOffset({
            x: input.clientX - bounds.left,
            y: input.clientY - bounds.top,
          });
          setPointer(input);
        },
        onDrag: ({ location }) => {
          setState("dragging");
          setPointer(location.current.input);
        },
        onDrop: () => {
          setState("idle");
          resetDraggable();
        },
        onGenerateDragPreview: ({ source, nativeSetDragImage }) => {
          disableNativeDragPreview({ nativeSetDragImage });

          const bounds = source.element.getBoundingClientRect();
          if (!bounds) return;

          setPreview({
            element: source.element,
            bounds,
          });
        },
      }),
      dropTargetForElements({
        element,
        canDrop: options.canDrop,
        getData: options.getData,
        onDragEnter: () => setState("over"),
        onDragLeave: () => setState("idle"),
        onDrop: () => setState("idle"),
      })
    );

    return () => cleanup();
  }, [options, resetDraggable]);

  useLayoutEffect(() => {
    const element = previewElement.current;
    if (!element || !pointer || !offset) return;

    const animationFrame = requestAnimationFrame(() => {
      if (!element) return;
      const x = pointer.clientX - offset.x;
      const y = pointer.clientY - offset.y;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [previewElement, pointer, offset]);

  return {
    state,
    preview,
    previewElement,
  };
};
