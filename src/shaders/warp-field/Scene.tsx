import React from "react";
import { WarpFieldBackground } from "./WarpFieldBackground";
import "../threeui.css";

export function Scene() {
  return (
    <div className="shader-frame">
      <WarpFieldBackground
        speed={15.0}
        streakOpacity={0.60}
        tileOpacity={0.90}
        fov={75}
        hue={0}
        saturation={1.00}
        brightness={1.00}
      />
    </div>
  );
}

export default Scene;
