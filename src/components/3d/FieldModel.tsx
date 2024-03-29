import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";
export interface FieldProps {
  field: string;
}
const FieldModel: React.FC<FieldProps> = ({ field }) => {
  const { scene } = useGLTF(field);
  useEffect(() => {
    scene.traverse((node: any) => {
      let mesh = node as THREE.Mesh; // Traverse function returns Object3d or Mesh
      if (mesh.isMesh && mesh.material instanceof THREE.MeshStandardMaterial) {
        let material = mesh.material as THREE.MeshStandardMaterial;
        material.metalness = 0;
        material.roughness = 1;
      }
    });
  }, [scene]);
  //console.log("rendering");

  return (
    <mesh>
      <ambientLight />
      {scene != undefined && <primitive object={scene} />}
    </mesh>
  );
};

export default FieldModel;
