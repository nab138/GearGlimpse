import {
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams } from "react-router";
import "./Field.css";

import * as THREE from "three";
import ThreeComponent from "../components/ThreeComponent";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

import { arrowUpOutline, chevronUpOutline, settingsOutline } from "ionicons/icons";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const Page: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>3D Field</IonTitle>
          {/* Settings and Dismiss Button Icons */}
          <IonTitle  slot="end">
            <IonIcon className="field-buttons" icon={settingsOutline} />
            <IonIcon className="field-buttons" icon={chevronUpOutline} />
          </IonTitle>

        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ThreeComponent />
      </IonContent>
    </IonPage>
  );
};

export default Page;
