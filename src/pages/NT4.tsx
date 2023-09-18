import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./NT4.css";

import storage from "../utils/storage";
import { useState } from "react";
import {
  connectURI,
  connectTeamNumber,
  connectionStatus,
  getEntryList,
} from "../utils/networktables";

const Page: React.FC = () => {
  const [useAddress, setUseAddress] = useState(false);
  (async () => {
    setUseAddress(await storage().get("useAddress"));
  })();

  const [connected, setConnected] = useState("Disconnected");

  setInterval(() => {
    setConnected(connectionStatus);
  }, 50);
  const [ip, setIp] = useState("");
  (async () => {
    setIp(await storage().get("ip"));
  })();

  const [teamNumber, setTeamNumber] = useState("");
  (async () => {
    setTeamNumber(await storage().get("teamNumber"));
  })();

  const [port, setPort] = useState("5810");
  (async () => {
    let port = await storage().get("port");
    if (port == undefined) {
      await storage().set("port", "5810");
      port = "5810";
    }
    setPort(port);
  })();

  return (
    <IonPage>
      <IonHeader className={"nt4-header-" + connected}>
        <IonToolbar className={"nt4-header-" + connected}>
          <IonTitle>NT4 - {connected}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="nt4-container">
          <IonItem className="ion-no-padding nt4-item">
            <IonInput
              type={useAddress ? "text" : "number"}
              placeholder={useAddress ? "Address" : "Team Number"}
              id="ip"
              value={useAddress ? ip : teamNumber}
              onInput={() => {
                storage().set(
                  useAddress ? "ip" : "teamNumber",
                  (document.getElementById("ip") as HTMLInputElement).value
                );
              }}
            />
          </IonItem>
          <IonItem className="ion-no-padding nt4-item">
            <IonInput
              type="text"
              placeholder="Port"
              id="port"
              value={port}
              onInput={() => {
                storage().set(
                  "port",
                  (document.getElementById("port") as HTMLInputElement).value
                );
              }}
            />
          </IonItem>
          <IonCheckbox
            id="useAddress"
            className="checkbox"
            labelPlacement="end"
            checked={useAddress}
            onIonChange={() => {
              setUseAddress(
                (document.getElementById("useAddress") as HTMLInputElement)
                  .checked
              );
              storage().set(
                "useAddress",
                (document.getElementById("useAddress") as HTMLInputElement)
                  .checked
              );
            }}
          >
            Use Manual Address
          </IonCheckbox>
          <IonButton
            className="button"
            onClick={() => {
              let ip = (document.getElementById("ip") as HTMLInputElement)
                .value;
              let port = (document.getElementById("port") as HTMLInputElement)
                .value;
              if (useAddress) {
                connectURI(ip, parseInt(port));
              } else {
                connectTeamNumber(parseInt(ip), parseInt(port));
              }
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
