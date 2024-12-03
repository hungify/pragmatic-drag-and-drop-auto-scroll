export type DraggableState = "idle" | "preview" | "dragging" | "over";

export type TItem = {
  id: string;
  title: string;
  pinned: boolean;
  image: string;
};
