import Image from "@atlaskit/image";
import { Box } from "@atlaskit/primitives";
import { TItem } from "../shared";
import { cardStyles, cartPreviewStyles } from "../shared/style";

interface CardPreviewProps {
  item: TItem;
  showImage: boolean;
}
export default function CardPreview({ item, showImage }: CardPreviewProps) {
  return (
    <Box xcss={[cardStyles, cartPreviewStyles]}>
      {showImage ? (
        <Image
          src={item.image}
          alt={item.title}
          style={{ pointerEvents: "none" }}
        />
      ) : (
        <span>{item.title}</span>
      )}
    </Box>
  );
}
