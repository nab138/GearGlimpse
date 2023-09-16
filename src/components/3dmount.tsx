import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { ScreenOrientation } from "@awesome-cordova-plugins/screen-orientation";
import storage from "../storage";

// init
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.01,
  100
);
camera.position.z = 10;
camera.position.y = 5;

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

export async function loadRobotModel(model: string) {
  loader.load(
    model,
    (gltf) => {
      scene.remove(robot);
      robot = gltf.scene;
      robot.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
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
  robot.visible = true;
  robot.position.set(-(x - 8.25), 0, y - 4);
  robot.rotation.z = ((rotation - 90) * Math.PI) / 180;
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
    await loadRobotModel((await storage().get("robot")) ?? "Robot_KitBot.glb");
    container.insertBefore(renderer.domElement, container.firstChild);
  } else {
    renderer.domElement.remove();
  }
}
