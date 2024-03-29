import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import * as THREE from "three";

export interface RobotConfig {
  position: [number, number, number];
  rotations: RobotConfigRotation[];
}

export interface RobotConfigRotation {
  axis: "x" | "y" | "z";
  degrees: number;
}

export const robotProps = {
  KitBot: {
    rotations: [
      { axis: "x", degrees: -90 },
      { axis: "y", degrees: -90 },
    ],
    position: [-0.12, 0, 3.15],
  } as RobotConfig,
  "Duck Bot": {
    rotations: [
      { axis: "x", degrees: -90 },
      { axis: "y", degrees: -90 },
    ],
    position: [0, 0, 0],
  } as RobotConfig,
  "Crab Bot": {
    rotations: [{ axis: "x", degrees: -90 }],
    position: [0, 0, 0.045],
  } as RobotConfig,
};

export interface RobotModelProps {
  robot: string;
  position: [number, number, number];
}
const RobotModel: React.FC<RobotModelProps> = ({
  robot: robotName,
  position,
}) => {
  const robotInner = useGLTF("Robot_" + robotName + ".glb").scene;
  const [robot, setRobot] = useState<THREE.Group | undefined>(undefined);
  useEffect(() => {
    let robotConfig = robotProps[robotName as keyof typeof robotProps];
    robotInner.rotation.setFromQuaternion(
      getQuaternionFromRotSeq(robotConfig.rotations)
    );
    robotInner.position.set(...robotConfig.position);
    let robotTemp = new THREE.Group();
    robotTemp.add(robotInner);
    // Make temporarily invisible
    //robot.visible = false;
    robotTemp.traverse((node: any) => {
      let mesh = node as THREE.Mesh; // Traverse function returns Object3d or Mesh
      if (mesh.isMesh && mesh.material instanceof THREE.MeshStandardMaterial) {
        let material = mesh.material as THREE.MeshStandardMaterial;
        material.metalness = 0;
        material.roughness = 1;
      }
    });
    setRobot(robotTemp);
  }, [robotInner]);

  useEffect(() => {
    if (robot !== undefined) {
      if (position[0] === -1 && position[1] === -1 && position[2] === -1) {
        robot.visible = false;
        return;
      }
      let x = -(position[0] - 8.25);
      let y = position[1] - 4;
      let rotation = position[2];
      robot.visible = true;
      robot.position.set(x, 0, y);
      robot.rotation.y = (rotation * Math.PI) / 180;
    }
  }, [position, robot]);
  return <>{robot !== undefined && <primitive object={robot} />}</>;
};

export default RobotModel;

function getQuaternionFromRotSeq(
  rotations: RobotConfigRotation[]
): THREE.Quaternion {
  let quaternion = new THREE.Quaternion();
  rotations.forEach((rotation) => {
    let axis = new THREE.Vector3(0, 0, 0);
    if (rotation.axis == "x") axis.setX(1);
    if (rotation.axis == "y") axis.setY(1);
    if (rotation.axis == "z") axis.setZ(1);
    quaternion.premultiply(
      new THREE.Quaternion().setFromAxisAngle(
        axis,
        (rotation.degrees * Math.PI) / 180
      )
    );
  });
  return quaternion;
}
