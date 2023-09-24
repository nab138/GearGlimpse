import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
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
import { NetworkTablesTopic, NetworkTablesTypeInfos } from "ntcore-ts-client";
import {
  getClient,
  listenerStates,
  subscribe,
} from "../../utils/networktables";
import NTSelect from "../../components/NTSelect";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const topics: NetworkTablesTopic<number>[] = [];

const Page: React.FC = () => {
  const modal = useRef<HTMLIonModalElement>(null);

  const [connected, setConnected] = useState("Disconnected");
  listenerStates.push(setConnected);

  let [leftKeys, setLeftKeys] = useState<string[]>([""]);
  let [rightKeys, setRightKeys] = useState<string[]>([""]);
  let [lastConfirmedLeftKeys, setLastConfirmedLeftKeys] = useState<string[]>([
    "",
  ]);
  let [lastConfirmedRightKeys, setLastConfirmedRightKeys] = useState<string[]>([
    "",
  ]);
  let [data, setData] = useState<any>([]);

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        type: "linear" as const,
        // Prevent from getting too zoomed out, just start sliding when we're at 10% of the scale
      },
      y: {
        type: "linear" as const,
        display: leftKeys.length > 0,
        position: "left" as const,
      },
      y1: {
        type: "linear" as const,
        display: rightKeys.length > 0,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
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

  useEffect(() => {
    (async () => {
      let leftKeys = await storage().get("graphKeysLeft");
      if (leftKeys == undefined) {
        await storage().set("graphKeysLeft", [""]);
        leftKeys = [""];
      }
      setLeftKeys(leftKeys);
      setLastConfirmedLeftKeys(leftKeys);

      let rightKeys = await storage().get("graphKeysRight");
      if (rightKeys == undefined) {
        await storage().set("graphKeysright", [""]);
        rightKeys = [""];
      }
      setRightKeys(rightKeys);
      setLastConfirmedRightKeys(rightKeys);
    })();
  }, []);

  useEffect(() => {
    console.log("Rebuilding Graph");
    setData([]);
    data = [];
    topics.forEach((topic) => {
      topic.unsubscribeAll();
    });
    topics.splice(0, topics.length);

    let allKeys = [...lastConfirmedLeftKeys, ...lastConfirmedRightKeys];

    allKeys.forEach((key) => {
      let topic = getClient()?.createTopic<number>(
        key,
        NetworkTablesTypeInfos.kDouble
      );
      if (topic != null && topic != undefined) topics.push(topic);
    });

    let tempData = [] as any[];
    topics.forEach((topic) => {
      let color = randomRGB();
      let dataset = {
        label: topic.name,
        data: [] as { x: number; y: number }[],
        backgroundColor: color,
        borderColor: color,
        pointRadius: 0,
        yAxisID: rightKeys.includes(topic.name) ? "y1" : "y",
      };
      let index = tempData.length;
      tempData.push(dataset);

      topic.subscribe(
        (value) => {
          if (topic.lastChangedTime == null || value == null) return;
          // From microseconds to seconds
          dataset.data.push({ x: topic.lastChangedTime * 0.000001, y: value });
          let temp = [...data];
          temp[index] = dataset;
          setData(temp);
          data = temp;
        },
        true,
        {
          periodic: 0.05,
        }
      );
    });
    setData(tempData);
  }, [lastConfirmedLeftKeys, lastConfirmedRightKeys, connected]);

  function onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role == "confirm") {
      storage().set("graphKeysLeft", leftKeys);
      setLastConfirmedLeftKeys(leftKeys);
      storage().set("graphKeysRight", rightKeys);
      setLastConfirmedRightKeys(rightKeys);
    } else {
      setLeftKeys(lastConfirmedLeftKeys);
      setRightKeys(lastConfirmedRightKeys);
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
              datasets: data,
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
          <IonContent className="field-settings">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Left Axis</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {leftKeys.map((key, index) => (
                    <IonItem
                      className="ion-no-padding test"
                      key={index}
                      lines="full"
                    >
                      <NTSelect
                        key={index}
                        initialValue={key}
                        onSelectionChange={(e) => {
                          let temp = [...leftKeys];
                          temp[index] = e ?? "";
                          setLeftKeys(temp);
                        }}
                      />
                      <IonIcon
                        icon={closeCircle}
                        onClick={() => {
                          setLeftKeys(leftKeys.filter((_, i) => i !== index));
                        }}
                      />
                    </IonItem>
                  ))}
                </IonList>
                <IonButton
                  className="add-value-btn"
                  onClick={() => {
                    setLeftKeys([...leftKeys, ""]);
                  }}
                >
                  Add a value
                </IonButton>
              </IonCardContent>
            </IonCard>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Right Axis</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {rightKeys.map((key, index) => (
                    <IonItem key={index} lines="full">
                      <NTSelect
                        initialValue={key}
                        key={index}
                        onSelectionChange={(e) => {
                          let temp = [...rightKeys];
                          temp[index] = e ?? "";
                          setRightKeys(temp);
                        }}
                      />
                      <IonIcon
                        icon={closeCircle}
                        onClick={() => {
                          setRightKeys(rightKeys.filter((_, i) => i !== index));
                        }}
                      />
                    </IonItem>
                  ))}
                </IonList>
                <IonButton
                  className="add-value-btn"
                  onClick={() => {
                    setRightKeys([...rightKeys, ""]);
                  }}
                >
                  Add a value
                </IonButton>
              </IonCardContent>
            </IonCard>
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

const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);

const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;
