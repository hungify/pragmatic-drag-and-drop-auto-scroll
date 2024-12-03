import Button from "@atlaskit/button/new";
import React, { useEffect, useState } from "react";

const FPSCounter: React.FC = () => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let lastFrameTime = performance.now();
    let frameCount = 0;

    const updateFps = () => {
      const now = performance.now();
      frameCount++;
      if (now >= lastFrameTime + 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastFrameTime = now;
      }
      requestAnimationFrame(updateFps);
    };

    const animationFrameId = requestAnimationFrame(updateFps);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return <Button>{fps} FPS</Button>;
};

export default FPSCounter;
