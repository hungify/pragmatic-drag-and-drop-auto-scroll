import { TItem } from "../shared";

export function isRectangleColliding({
  fixedRect,
  previewRect,
}: {
  fixedRect: DOMRect;
  previewRect: DOMRect;
}) {
  return (
    fixedRect.left < previewRect.right &&
    fixedRect.right > previewRect.left &&
    fixedRect.top < previewRect.bottom &&
    fixedRect.bottom > previewRect.top
  );
}

export function getColumns({
  count,
  prefix,
}: {
  count: number;
  prefix: string;
}): TItem[] {
  const items = Array.from({ length: count }, (_, itemIndex) => {
    return {
      id: `${prefix}-${itemIndex}`,
      title: `${prefix} ${itemIndex}`,
      pinned: itemIndex % 2 === 0,
      image: `https://placehold.co/40x40?text=${prefix}-${itemIndex}`,
    };
  });
  return items;
}
