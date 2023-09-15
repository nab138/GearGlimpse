import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  createAnimation,
  type Animation,
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
import { useEffect, useRef } from "react";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const Page: React.FC = () => {
  const outToolAnimation = useRef<Animation | null>(null);
  const outAnimation = useRef<Animation | null>(null);

  const inToolAnimation = useRef<Animation | null>(null);
  const inAnimation = useRef<Animation | null>(null);

  const header = useRef<HTMLIonHeaderElement | null>(null);
  useEffect(() => {
    if (outAnimation.current === null) {
      outToolAnimation.current = createAnimation()
        .addElement(header.current!)
        .duration(100)
        .fromTo("transform", "translateY(0)", "translateY(-100%)");

      outAnimation.current = createAnimation()
        .addElement(document.querySelector("ion-tab-bar")!)
        .duration(100)
        .fromTo("transform", "translateY(0)", "translateY(100%)")
        .addAnimation(outToolAnimation.current);
    }
    if(inAnimation.current === null) {
      inToolAnimation.current = createAnimation()
        .addElement(header.current!)
        .duration(100)
        .fromTo("transform", "translateY(-100%)", "translateY(0)");

      inAnimation.current = createAnimation()
        .addElement(document.querySelector("ion-tab-bar")!)
        .duration(100)
        .fromTo("transform", "translateY(100%)", "translateY(0)")
        .addAnimation(inToolAnimation.current);
    }
  }, [header]);

  function bringToolsBack(e: MouseEvent){
    // IF e is in the top or bottom 15% of the screen, don't bring the tools back
    if(e.clientY > window.innerHeight * 0.15 && e.clientY < window.innerHeight * 0.85) return;
    inAnimation.current?.play();
    inAnimation.current?.onFinish(() => {
      inAnimation.current?.stop();
      header.current?.style.setProperty("transform", "translateY(0)");
      document.querySelector("ion-tab-bar")?.style.setProperty("transform", "translateY(0)");
    });
    
    window.removeEventListener("click", bringToolsBack);
  }

  return (
    <IonPage>
      <IonHeader className="field-header" ref={header} mode="ios">
        <IonToolbar>
          <IonTitle>3D Field</IonTitle>
          {/* Settings and Dismiss Button Icons */}
          <IonButtons slot="primary">
            <IonButton fill="clear">
              <IonIcon className="field-buttons" icon={settingsOutline} />
            </IonButton>
          </IonButtons>
          <IonButtons slot="secondary">
            <IonButton fill="clear" onClick={
              () => {
                outAnimation.current?.onFinish(() => {
                  window.addEventListener("click", bringToolsBack);
                  outAnimation.current?.stop();
                  header.current?.style.setProperty("transform", "translateY(-100%)");
                  document.querySelector("ion-tab-bar")?.style.setProperty("transform", "translateY(100%)");
              });
                outAnimation.current?.play();
              }
            }>
              <IonIcon className="field-buttons" icon={chevronUpOutline} />
            </IonButton>
          </IonButtons>

        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ThreeComponent />
      </IonContent>
    </IonPage>
  );
};

export default Page;