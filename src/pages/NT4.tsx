import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./NT4.css";
import { NetworkTables } from "ntcore-ts-client";
import storage from "../storage";
import { useState } from "react";

const Page: React.FC = () => {
  const [ip, setIp] = useState("");
  (async () => {
    setIp(await storage().get("ip"));
  })();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>NT4 Setup</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="nt4-container">
          <IonInput
            type="text"
            placeholder="RoboRIO IP"
            id="ip"
            value={ip}
            onInput={() => {
              setIp((document.getElementById("ip") as HTMLInputElement).value);
              storage().set(
                "ip",
                (document.getElementById("ip") as HTMLInputElement).value
              );
            }}
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
