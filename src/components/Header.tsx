import { Box, Flex } from "@atlaskit/primitives";
import React from "react";
import FPSCounter from "./FPSCounter";
import Button from "@atlaskit/button/new";

interface HeaderProps {
  scrollMode: "window" | "list";
  setScrollMode: (value: "window" | "list") => void;
  showImage: boolean;
  setShowImage: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  scrollMode,
  setScrollMode,
  showImage,
  setShowImage,
}) => {
  const toggleScrollMode = () => {
    setScrollMode(scrollMode === "window" ? "list" : "window");
  };

  const toggleShowImage = () => {
    setShowImage(!showImage);
  };

  return (
    <Box as="header" padding="space.200" backgroundColor="elevation.surface">
      <Flex justifyContent="space-between" alignItems="center">
        <FPSCounter />
        <Flex gap="space.200">
          <Button onClick={toggleScrollMode} appearance="primary">
            Scroll: {scrollMode === "window" ? "Window" : "List"}
          </Button>
          <Button appearance="primary" onClick={toggleShowImage}>
            Mode: {showImage ? "Image" : "Text"}
          </Button>
          <a
            href="https://github.com/hungify/pragmatic-custom-preview"
            target="_blank"
            style={{ display: "flex", alignItems: "center" }}
          >
            <img
              src="/icons/github.svg"
              alt="GitHub"
              style={{ width: 28, height: 28 }}
            />
          </a>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
