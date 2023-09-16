import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams } from "react-router";
import "./NT4.css";
import { NetworkTables } from "ntcore-ts-client";
import storage from "../storage";
import { useEffect, useState } from "react";

const Page: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  let rendered = false;

  const [ip, setIp] = useState("");
  useEffect(() => {
     async function getIP() {
      if((await storage().keys()).includes("ip")) {
         const ip = await storage().get("ip") as string;
         setIp(ip);
      }
    }
     getIP();
     rendered = true;
  }, [])
  
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
              storage().set("ip", (document.getElementById("ip") as HTMLInputElement).value);
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
