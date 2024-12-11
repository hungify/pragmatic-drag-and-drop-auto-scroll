import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";
import invariant from "tiny-invariant";

import { easeInOut, mediumDurationMs } from "@atlaskit/motion";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { Input } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { Box, xcss } from "@atlaskit/primitives";
import { centerUnderPointer } from "@atlaskit/pragmatic-drag-and-drop/element/center-under-pointer";
import { useScroll, useWindowScroll } from "react-use";

const cardStyles = xcss({
  height: "size.400",
  borderWidth: "border.width",
  borderColor: "color.border.accent.purple",
  borderStyle: "solid",
  backgroundColor: "color.background.accent.purple.subtler",
  borderRadius: "border.radius",
  transitionProperty: "background-color, opacity",
  transitionDuration: `${mediumDurationMs}ms`,
  transitionTimingFunction: easeInOut,

  display: "flex",
  alignItems: "center",
  padding: "space.050",

  color: "color.text.accent.red",
});

export type TItem = { id: string; title: string; pinned: boolean };

type CardState =
  | { type: "idle" }
  | { type: "preview"; container: HTMLElement }
  | { type: "is-dragging" }
  | { type: "is-over" };

const cardStateStyles: {
  [Key in CardState["type"]]: ReturnType<typeof xcss> | undefined;
} = {
  idle: undefined,
  preview: undefined,
  "is-dragging": xcss({ opacity: 0.4 }),
  "is-over": xcss({
    backgroundColor: "color.background.accent.purple.subtler.hovered",
  }),
};

const idle: CardState = { type: "idle" };
// const isDragging: CardState = { type: "is-dragging" };
const isOver: CardState = { type: "is-over" };

export default function CardCustom({ item }: { item: TItem }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<CardState>(idle);
  const [rect, setRect] = useState<DOMRect>();
  const [input, setInput] = useState<Input>();
  const previewRef = useRef<HTMLDivElement | null>(null);

  const viewportScroll = useWindowScroll();

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    return combine(
      draggable({
        element,
        getInitialData: () => item,
        canDrag: () => item.pinned === false,
        onDrag: ({ location }) => {
          setInput(location.current.input);
        },
        onDragStart: ({ location }) => {
          setInput(location.current.input);
        },
        onGenerateDragPreview: ({ source, nativeSetDragImage }) => {
          disableNativeDragPreview({ nativeSetDragImage });
          setState({
            type: "preview",
            container: source.element,
          });
          const currentRect = ref.current?.getBoundingClientRect();
          if (!currentRect) return;

          setRect({
            ...currentRect,
            top: currentRect.top + window.scrollY,
            left: currentRect.left + window.scrollX,
          });
        },
        onDrop: () => setState(idle),
      }),
      dropTargetForElements({
        element,
        getData: () => item,
        canDrop: () => item.pinned,
        onDragStart: () => setState(isOver),
        // onDragEnter: () => setState(isOver),
        // onDragLeave: () => setState(idle),
        onDrop: () => setState(idle),
      })
    );
  }, [item]);

  const pinnedStyles = xcss({
    backgroundColor: "color.background.accent.gray.subtlest.pressed",
    borderColor: "color.border.accent.gray",
    color: "color.text.accent.gray",
    cursor: "not-allowed",
  });

  useEffect(() => {
    const updatePosition = () => {
      if (!previewRef.current || !input || !rect) return;

      // const { x, y } = centerUnderPointer({
      //   container: previewRef.current,
      // });

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const translateX = input.clientX - rect.width / 2;
      const translateY = input.clientY + window.scrollY - rect.height / 2;

      previewRef.current.style.transform = `translate(${translateX}px, ${translateY}px)`;

      requestAnimationFrame(updatePosition);
    };

    const animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [input, rect, viewportScroll, viewportScroll.y]);
  return (
    <Fragment>
      <Box
        ref={ref}
        xcss={[
          cardStyles,
          cardStateStyles[state.type],
          item.pinned && pinnedStyles,
        ]}
        testId={item.id}
      >
        {item.title}
      </Box>
      {state.type === "preview" && rect
        ? createPortal(
            <Box
              ref={previewRef}
              style={{
                position: "absolute",
                width: rect.width,
                height: rect.height,
                pointerEvents: "none",
                willChange: "transform",
              }}
            >
              <CardPreview rect={rect} item={item} />
            </Box>,
            state.container
          )
        : null}
    </Fragment>
  );
}

function CardPreview({ rect, item }: { rect: DOMRect; item: TItem }) {
  return (
    <Box xcss={cardStyles} style={{ width: rect.width, height: rect.height }}>
      {item.title}
    </Box>
  );
}
