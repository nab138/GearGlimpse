import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// init
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.01,
  100
);
camera.position.z = 5;

const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new THREE.MeshNormalMaterial();

// Add a gltf model
const loader = new GLTFLoader();
loader.load(
  "./Field3d_2023.glb",
  (gltf) => {
    let field = gltf.scene;
    scene.add(field);
    field.traverse((node: any) => {
      let mesh = node as THREE.Mesh; // Traverse function returns Object3d or Mesh
      if (mesh.isMesh && mesh.material instanceof THREE.MeshStandardMaterial) {
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

var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animation);

const clock = new THREE.Clock();
const cameraControls = new OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);

// animation

function animation(time: number) {
  const delta = clock.getDelta();
  const hasControlsUpdated = cameraControls.update(delta);

  renderer.render(scene, camera);
}

function resize() {
  const container = renderer.domElement.parentNode as HTMLElement | null;

  if (container) {
    const width = container?.offsetWidth;
    const height = container?.offsetHeight;

    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

window.addEventListener("resize", resize);

export function mount(container: HTMLElement | null) {
  if (container) {
    container.insertBefore(renderer.domElement, container.firstChild);
  } else {
    renderer.domElement.remove();
  }
}
