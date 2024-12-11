import { Fragment, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";
import invariant from "tiny-invariant";

import { easeInOut, mediumDurationMs } from "@atlaskit/motion";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { Box, xcss } from "@atlaskit/primitives";

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
  | { type: "preview"; container: HTMLElement; rect: DOMRect }
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
const isDragging: CardState = { type: "is-dragging" };
const isOver: CardState = { type: "is-over" };

export default function CardNative({ item }: { item: TItem }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<CardState>(idle);

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    return combine(
      draggable({
        element,
        getInitialData: () => item,
        canDrag: () => item.pinned === false,
        onGenerateDragPreview: ({ source, nativeSetDragImage, location }) => {
          // Using a custom native drag preview
          // so that we get a nicer border radius on
          // the preview 👩‍🍳🤌
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element: source.element,
              input: location.initial.input,
            }),
            render({ container }) {
              setState({
                type: "preview",
                container,
                rect: element.getBoundingClientRect(),
              });
              return () => setState(isDragging);
            },
          });
        },
        onDragStart: () => setState(isDragging),
        onDrop: () => setState(idle),
      }),
      dropTargetForElements({
        element,
        getData: () => item,
        canDrop: () => item.pinned === false,
        onDragStart: () => setState(isOver),
        onDragEnter: () => setState(isOver),
        onDragLeave: () => setState(idle),
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
      {state.type === "preview"
        ? createPortal(
            <CardPreview rect={state.rect} item={item} />,
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
