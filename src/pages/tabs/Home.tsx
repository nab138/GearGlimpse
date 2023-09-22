import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams } from "react-router";
import "./Home.css";
import { book, home } from "ionicons/icons";

const Page: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Centered gretting text */}
        <div className="home-container">
          <h1>Welcome to GearGlimpse</h1>
          <p>Documentation coming soon™ (or maybe not)</p>
        </div>
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