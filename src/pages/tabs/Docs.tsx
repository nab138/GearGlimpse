import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Docs.css";
import { book } from "ionicons/icons";
import { useRef } from "react";
import NTSelect from "../../components/NTSelect";

const Page: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Docs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Centered gretting text */}
        <div className="top-docs-container">
          <h1>Welcome to GearGlimpse</h1>
          <p>⚠️ Docs are a WIP, and may be incomplete. ⚠️</p>
        </div>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Getting Started</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Visit the "Setup" tab in the bottom left to configure your tabs and
            set up NT4. Most tabs have extra options available by clicking the
            gear icon in the top right.
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Graph Tab</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            The Graph tab may not work exactly as you expect (for now). It is a
            little buggy and slow, but it should function. The x-axis (time)
            only updates when a new value is recieved for any value on the
            graph. This tab is still being worked on and will hopefully improve
            in the future.
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default {
  path: "/docs",
  displayName: "Docs",
  icon: book,
  tab: "docs",
  component: Page,
};
