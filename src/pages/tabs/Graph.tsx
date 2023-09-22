import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Graph.css";
import { barChart, closeCircle, settingsOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import storage from "../../utils/storage";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: false,
      text: "Chart.js Line Chart",
    },
  },
};

const Page: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);

  let [keys, setKeys] = useState<string[]>([""]);
  let [lastConfirmedKeys, setLastConfirmedKeys] = useState<string[]>([""]);
  let [data, setData] = useState<any>({});

  useEffect(() => {
    (async () => {
      let keys = await storage().get("graphKeys");
      if (keys == undefined) {
        await storage().set("graphKeys", [""]);
        keys = [""];
      }
      setKeys(keys);
    })();
  }, []);

  function onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role == "confirm") {
      storage().set("graphKeys", keys);
      setLastConfirmedKeys(keys);
    } else {
      console.log("not confirm");
      setKeys(lastConfirmedKeys);
    }
  }

  function confirm() {
    modal.current?.dismiss({}, "confirm");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Graph</IonTitle>
          <IonButtons slot="primary">
            <IonButton id="graph-settings" fill="clear">
              <IonIcon className="graph-buttons" icon={settingsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Centered gretting text */}
        <div className="graph-container">
          <Line
            options={options}
            data={{
              labels: ["0", "1", "2", "3", "4", "5"],
              datasets: [
                {
                  label: "Test Dataset",
                  data: [0, 20, 20, 60, 80, 100],
                  borderColor: "rgb(255, 99, 132)",
                  backgroundColor: "rgba(255, 99, 132, 0.5)",
                },
              ],
            }}
          />
        </div>
        <IonModal
          ref={modal}
          trigger="graph-settings"
          onWillDismiss={(ev) => onWillDismiss(ev)}
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>
                  Cancel
                </IonButton>
              </IonButtons>
              <IonTitle class="modal-title">Graph Setup</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => confirm()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding field-settings">
            <IonList>
              {keys.map((key, index) => (
                <IonItem lines="full">
                  <IonInput
                    type="text"
                    placeholder="NT Key"
                    value={key}
                    key={index}
                    onInput={(e) => {
                      let temp = [...keys];
                      temp[index] = e.currentTarget.value?.toString() ?? "";
                      setKeys(temp);
                    }}
                  />
                  <IonIcon
                    icon={closeCircle}
                    onClick={() => {
                      setKeys(keys.filter((_, i) => i !== index));
                    }}
                  />
                </IonItem>
              ))}
            </IonList>
            <IonButton
              className="add-value-btn"
              onClick={() => {
                setKeys([...keys, ""]);
              }}
            >
              Add a value
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default {
  path: "/graph",
  displayName: "Graph",
  icon: barChart,
  tab: "graph",
  component: Page,
};
