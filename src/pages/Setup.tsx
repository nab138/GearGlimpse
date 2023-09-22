import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Setup.css";

import storage from "../utils/storage";
import { useEffect, useState } from "react";
import {
  connectURI,
  connectTeamNumber,
  connectionStatus,
} from "../utils/networktables";
import BulkSelect from "../components/BulkSelect";
import { displayNames } from "./tabs";

interface SetupProps {
  setTabs: (items: string[]) => void;
  selectedTabs: string[];
}

const Page: React.FC<SetupProps> = (props: SetupProps) => {
  const [useAddress, setUseAddress] = useState(false);
  const [connected, setConnected] = useState("Disconnected");
  const [ip, setIp] = useState("");
  const [teamNumber, setTeamNumber] = useState("");
  const [port, setPort] = useState("5810");

  useEffect(() => {
    (async () => {
      setUseAddress(await storage().get("useAddress"));
    })();

    setInterval(() => {
      setConnected(connectionStatus);
    }, 50);

    (async () => {
      setIp(await storage().get("ip"));
    })();

    (async () => {
      setTeamNumber(await storage().get("teamNumber"));
    })();

    (async () => {
      let port = await storage().get("port");
      if (port == undefined) {
        await storage().set("port", "5810");
        port = "5810";
      }
      setPort(port);
    })();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Setup</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div
          className="setup-container"
          style={{
            marginBottom: "40px",
          }}
        >
          <IonCard className={"nt4-settings-" + connected.toLowerCase()}>
            <IonCardHeader>
              <IonCardTitle>NT4 - {connected}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem className="ion-no-padding nt4-item">
                <IonInput
                  className="nt4-input"
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
                  className="nt4-input"
                  type="text"
                  placeholder="Port"
                  id="port"
                  value={port}
                  onInput={() => {
                    storage().set(
                      "port",
                      (document.getElementById("port") as HTMLInputElement)
                        .value
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
              <br />
              <IonButton
                className="button"
                onClick={() => {
                  let ip = (document.getElementById("ip") as HTMLInputElement)
                    .value;
                  let port = (
                    document.getElementById("port") as HTMLInputElement
                  ).value;
                  if (useAddress) {
                    connectURI(ip, parseInt(port));
                  } else {
                    connectTeamNumber(parseInt(ip), parseInt(port));
                  }
                }}
              >
                {connected == "Disconnected" ? "C" : "Rec"}onnect to NT
              </IonButton>
            </IonCardContent>
          </IonCard>
          <IonCard className="tabs-card">
            <IonCardHeader>
              <IonCardTitle>Tabs</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <BulkSelect
                onChange={(newTabs: string[]) => {
                  storage().set("tabs", newTabs);
                }}
                items={displayNames}
                selectedItems={props.selectedTabs}
                setSelectedItems={props.setTabs}
                maxItems={4}
                minItems={1}
              />
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Page;
