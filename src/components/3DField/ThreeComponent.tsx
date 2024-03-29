import { Canvas } from "@react-three/fiber";
import FieldModel from "./FieldModel";
import React from "react";
import "./ThreeComponent.css";
import { OrbitControls, Stats } from "@react-three/drei";
import RobotModel from "./RobotModel";

export interface ThreeComponentProps {
  field: string;
  robot: string;
  position: [number, number, number];
  statsEnabled: boolean;
  cinematic: boolean;
}
const ThreeComponent: React.FC<ThreeComponentProps> = ({
  field,
  robot,
  position,
  statsEnabled,
  cinematic,
}) => {
  let [orientation, setOrientation] = React.useState(
    screen.orientation.type.split("-")[0]
  );
  window.addEventListener("orientationchange", function () {
    setOrientation(screen.orientation.type.split("-")[0]);
  });
  return (
    <>
      <Canvas
        shadows={cinematic}
        className="three-canvas"
        camera={{ position: [0, 10, -15] }}
      >
        {field !== "" && <FieldModel cinematic={cinematic} field={field} />}
        {robot !== "" && (
          <RobotModel key={field + robot} position={position} robot={robot} />
        )}
        <OrbitControls
          maxPolarAngle={Math.PI / 2}
          maxDistance={30}
          enableDamping={true}
          dampingFactor={0.25}
        />
      </Canvas>
      {statsEnabled && (
        <Stats key={orientation} className={"three-stats-" + orientation} />
      )}
    </>
  );
};

export default ThreeComponent;
