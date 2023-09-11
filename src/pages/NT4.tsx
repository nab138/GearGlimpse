import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams } from "react-router";
import "./NT4.css";
import { NetworkTables } from "ntcore-ts-client";

const Page: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>NT4 Setup</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="nt4-container">
          <input
            type="text"
            placeholder="RoboRIO IP"
            id="ip"
            onInput={() => {}}
          />
          <IonButton
            className="button"
            onClick={() => {
              NetworkTables.getInstanceByURI(
                (document.getElementById("ip") as HTMLInputElement).value
              );
            }}
          >
            Connect to NT
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Page;
