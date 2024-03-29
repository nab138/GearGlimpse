import { Canvas } from "@react-three/fiber";
import FieldModel from "./FieldModel";
import { useEffect, useState } from "react";
import storage from "../../utils/storage";
import { defaultField } from "../../pages/tabs/Field";
import { OrbitControls, Stats } from "@react-three/drei";

export default function ThreeComponent() {
  let [field, setField] = useState<string>("");

  useEffect(() => {
    (async () => {
      setField((await storage().get("field")) ?? `Field3d_${defaultField}.glb`);
    })();
  }, []);
  return (
    <Canvas camera={{ position: [0, 10, -15] }}>
      {field !== "" && <FieldModel field={field} />}
      <OrbitControls
        maxPolarAngle={Math.PI / 2}
        maxDistance={30}
        minDistance={0.2}
      />
      <Stats />
    </Canvas>
  );
}
