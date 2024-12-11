import { Box, Flex, Text, xcss } from "@atlaskit/primitives";
import "./App.css";
import ColumnNative from "./components/native-preview/column";
import ColumnCustom from "./components/custom-preview/column";

const columnContainerStyles = xcss({
  width: "min-content", // so we can have padding around the board
});

const boardStyles = xcss({
  display: "flex",
  gap: "space.200",
  overflowX: "auto",
  borderWidth: "border.width",
  borderColor: "color.border.accent.purple",
  borderStyle: "solid",
  borderRadius: "border.radius",
  padding: "space.200",
  backgroundColor: "elevation.surface.sunken",
});

function App() {
  return (
    <>
      <Box xcss={boardStyles}>
        {/* <Box>
          <Text size="large">Native</Text>
          <Flex gap="space.200" xcss={columnContainerStyles}>
            <ColumnNative />
          </Flex>
        </Box> */}
        <Box>
          <Text size="large">Custom</Text>
          <Flex gap="space.200" xcss={columnContainerStyles}>
            <ColumnCustom />
          </Flex>
        </Box>
      </Box>
    </>
  );
}

export default App;
