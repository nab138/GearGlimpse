import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Swerve.css";
import { car } from "ionicons/icons";

const Page: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Swerve</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Centered gretting text */}
        <div className="swerve-container">
          <h1>Swerve</h1>
          <p>Coming soon™ (or maybe not)</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default {
  path: "/swerve",
  displayName: "Swerve",
  icon: car,
  tab: "swerve",
  component: Page,
};
