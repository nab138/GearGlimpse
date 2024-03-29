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
}
const ThreeComponent: React.FC<ThreeComponentProps> = ({
  field,
  robot,
  position,
  statsEnabled,
}) => {
  return (
    <>
      <Canvas className="three-canvas" camera={{ position: [0, 10, -15] }}>
        {field !== "" && <FieldModel field={field} />}
        {robot !== "" && <RobotModel position={position} robot={robot} />}
        <OrbitControls
          maxPolarAngle={Math.PI / 2}
          maxDistance={30}
          minDistance={0.2}
          enableDamping={true}
          dampingFactor={0.25}
        />
      </Canvas>
      {statsEnabled && <Stats className="three-stats" />}
    </>
  );
};

export default ThreeComponent;
