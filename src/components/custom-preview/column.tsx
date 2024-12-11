import { useEffect, useRef, useState } from "react";

import invariant from "tiny-invariant";

import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { Box, Grid, xcss } from "@atlaskit/primitives";

import {
  autoScrollForElements,
  autoScrollWindowForElements,
} from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { TItem } from "./card";
import CardCustom from "./card";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";

const columnStyles = xcss({
  overflowY: "auto",
  // height: "700px",
  width: "440px",
  backgroundColor: "elevation.surface",
  borderColor: "color.border.accent.purple",
  borderRadius: "border.radius",
  borderWidth: "border.width",
  borderStyle: "solid",
  flexShrink: 0,
});

export default function ColumnCustom() {
  const [columns, setColumns] = useState(() => getColumns({ count: 150 }));
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    invariant(element);

    return combine(
      autoScrollForElements({
        element,
      }),
      autoScrollWindowForElements(),
      monitorForElements({
        onDrop({ source, location }) {
          const target = location.current.dropTargets[0];
          if (!target) {
            // preventUnhandled.start();
            return;
          }
          const sourceItem = source.data as TItem;
          const destinationItem = target.data as TItem;

          const sourceIndex = columns.findIndex(
            (item) => item.pinned === false && item.id === sourceItem.id
          );
          const destinationIndex = columns.findIndex(
            (item) => item.pinned === false && item.id === destinationItem.id
          );

          if (sourceIndex === -1 || destinationIndex === -1) {
            return;
          }

          setColumns((columns) => {
            const listClone = [...columns];
            listClone[sourceIndex].pinned = true;
            const [sourceItem] = listClone.splice(sourceIndex, 1);
            listClone.splice(destinationIndex, 0, sourceItem);
            return listClone;
          });
        },
      })
    );
  }, [columns]);

  return (
    <Box ref={ref} xcss={columnStyles} padding="space.200">
      <Grid templateColumns="1fr 1fr" testId="grid-basic" gap="space.200">
        {columns.map((item) => (
          <CardCustom key={item.id} item={item} />
        ))}
      </Grid>
    </Box>
  );
}

function getColumns({ count }: { count: number }) {
  const items = Array.from({ length: count }, (_, itemIndex) => {
    return {
      id: `item-${itemIndex}`,
      title: `Item ${itemIndex}`,
      pinned: itemIndex % 2 === 0,
    };
  });
  return items;
}
