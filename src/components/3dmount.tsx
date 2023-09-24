import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ScreenOrientation } from "@awesome-cordova-plugins/screen-orientation";
import storage from "../utils/storage";
import { robotProps } from "../pages/tabs/Field";

// init
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.01,
  100
);
camera.position.z = -15;
camera.position.y = 10;

const scene = new THREE.Scene();
let field: THREE.Group<THREE.Object3DEventMap>;
let robot: THREE.Group<THREE.Object3DEventMap>;

const loader = new GLTFLoader();
export async function loadFieldModel(model: string) {
  loader.load(
    model,
    (gltf) => {
      scene.remove(field);
      field = gltf.scene;
      scene.add(field);
      field.traverse((node: any) => {
        let mesh = node as THREE.Mesh; // Traverse function returns Object3d or Mesh
        if (
          mesh.isMesh &&
          mesh.material instanceof THREE.MeshStandardMaterial
        ) {
          let material = mesh.material as THREE.MeshStandardMaterial;
          material.metalness = 0;
          material.roughness = 1;
        }
      });
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );
}

export async function loadRobotModel(model: string, robotConfig: RobotConfig) {
  loader.load(
    model,
    (gltf) => {
      scene.remove(robot);
      let robotInner = gltf.scene;
      robotInner.rotation.setFromQuaternion(
        getQuaternionFromRotSeq(robotConfig.rotations)
      );
      robotInner.position.set(...robotConfig.position);
      robot = new THREE.Group();
      robot.add(robotInner);
      // Make temporarily invisible
      robot.visible = false;
      scene.add(robot);
      robot.traverse((node: any) => {
        let mesh = node as THREE.Mesh; // Traverse function returns Object3d or Mesh
        if (
          mesh.isMesh &&
          mesh.material instanceof THREE.MeshStandardMaterial
        ) {
          let material = mesh.material as THREE.MeshStandardMaterial;
          material.metalness = 0;
          material.roughness = 1;
        }
      });
    },
    undefined,
    (error) => {
      console.error(error);
    }
  );
}

export function setRobotPosition(x: number, y: number, rotation: number) {
  if (robot == undefined) return;
  robot.visible = true;
  robot.position.set(-(x - 8.25), 0, y - 4);
  robot.rotation.y = (rotation * Math.PI) / 180;
}

export interface RobotConfig {
  position: [number, number, number];
  rotations: RobotConfigRotation[];
}

export interface RobotConfigRotation {
  axis: "x" | "y" | "z";
  degrees: number;
}
/** Converts a rotation sequence to a quaternion. */
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

var directionalLight = new THREE.AmbientLight(0xffffff);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);

const clock = new THREE.Clock();
const cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.maxPolarAngle = Math.PI / 2;
cameraControls.maxDistance = 30;
cameraControls.minDistance = 0.2;
cameraControls.saveState();
document.body.appendChild(renderer.domElement);

// animation

function animation(time: number) {
  const delta = clock.getDelta();
  cameraControls.update(delta);

  renderer.render(scene, camera);
}

function resize() {
  const container = renderer.domElement.parentNode as HTMLElement | null;

  if (container) {
    // Use entire window
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  cameraControls.reset();
}

window.addEventListener("resize", resize);
// On orientation change, resize the renderer
ScreenOrientation.onChange().subscribe(() => {
  setTimeout(resize, 2);
});

export async function mount(container: HTMLElement | null) {
  if (container) {
    await loadFieldModel((await storage().get("field")) ?? "Field3d_2023.glb");
    let robot = (await storage().get("robot")) ?? "Robot_KitBot.glb";
    let robotName = robot?.split("_")[1].split(".")[0];
    await loadRobotModel(
      robot,
      robotProps[robotName as keyof typeof robotProps]
    );
    container.insertBefore(renderer.domElement, container.firstChild);
  } else {
    renderer.domElement.remove();
  }
}
