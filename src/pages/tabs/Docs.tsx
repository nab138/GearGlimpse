import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Docs.css";
import { book } from "ionicons/icons";

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
            <IonCardTitle>Quickstart</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Visit the "Setup" tab in the bottom left to configure your tabs and
            set up NT4.
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
