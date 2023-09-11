import { useCallback } from "react";
import { mount } from "./3dmount";

export default function ThreeComponent() {
  const containerRef = useCallback(mount, []);
  return <div className="three-container" ref={containerRef}></div>;
}
