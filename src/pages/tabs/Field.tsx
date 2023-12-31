import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  createAnimation,
  type Animation,
  IonModal,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonInput,
} from "@ionic/react";
import "./Field.css";
import storage from "../../utils/storage";

const fields = ["2023", "2022"];
const robots = ["KitBot", "Duck Bot", "Crab Bot"];

import { chevronUpOutline, map, settingsOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import ThreeComponent from "../../components/ThreeComponent";
import {
  RobotConfig,
  loadFieldModel,
  loadRobotModel,
  setRobotPosition,
} from "../../components/3dmount";
import { NetworkTablesTopic, NetworkTablesTypeInfos } from "ntcore-ts-client";
import { listenerStates, subscribe } from "../../utils/networktables";
import NTSelect from "../../components/NTSelect";

export const robotProps = {
  KitBot: {
    rotations: [
      { axis: "x", degrees: -90 },
      { axis: "y", degrees: -90 },
    ],
    position: [-0.12, 0, 3.15],
  } as RobotConfig,
  "Duck Bot": {
    rotations: [
      { axis: "x", degrees: -90 },
      { axis: "y", degrees: -90 },
    ],
    position: [0, 0, 0],
  } as RobotConfig,
  "Crab Bot": {
    rotations: [{ axis: "x", degrees: -90 }],
    position: [0, 0, 0.045],
  } as RobotConfig,
};

const Page: React.FC = () => {
  const outToolAnimation = useRef<Animation | null>(null);
  const outAnimation = useRef<Animation | null>(null);

  const inToolAnimation = useRef<Animation | null>(null);
  const inAnimation = useRef<Animation | null>(null);

  const header = useRef<HTMLIonHeaderElement | null>(null);

  const modal = useRef<HTMLIonModalElement>(null);
  const fieldInput = useRef<HTMLIonSelectElement>(null);
  const robotInput = useRef<HTMLIonSelectElement>(null);

  const [connected, setConnected] = useState("Disconnected");
  listenerStates.push(setConnected);

  function moveRobotCallback(value: number[]): void {
    if (value == null) return;
    setRobotPosition(value[0], value[1], value[2]);
  }

  const [robotTopic, setRobotTopic] = useState<
    NetworkTablesTopic<number[]> | null | undefined
  >(null);

  const [field, setField] = useState("2023");
  const [robot, setRobot] = useState("KitBot");
  const [robotKey, setRobotKey] = useState("");
  const [unconfirmedRobotKey, setUnconfirmedRobotKey] = useState("");

  useEffect(() => {
    (async () => {
      let field = await storage().get("field");
      if (field == undefined) {
        await storage().set("field", "Field3d_2023.glb");
        field = "Field3d_2023.glb";
      }
      setField(field.split("_")[1].split(".")[0]);
    })();

    (async () => {
      let robot = await storage().get("robot");
      if (robot == undefined) {
        await storage().set("robot", "Robot_KitBot.glb");
        robot = "Robot_KitBot.glb";
      }
      setRobot(robot.split("_")[1].split(".")[0]);
    })();

    (async () => {
      let robotKey = await storage().get("robotKey");
      if (robotKey == undefined) {
        await storage().set("robotKey", "/SmartDashboard/Field/Robot");
        robotKey = "/SmartDashboard/Field/Robot";
      }

      console.log(robotKey);
      setRobotKey(robotKey);
      setUnconfirmedRobotKey(robotKey);
    })();
  }, []);

  function confirm() {
    modal.current?.dismiss(
      {
        field: fieldInput.current?.value,
        robot: robotInput.current?.value,
      },
      "confirm"
    );
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === "confirm") {
      storage().set("field", `Field3d_${ev.detail.data.field}.glb`);
      loadFieldModel(`Field3d_${ev.detail.data.field}.glb`);
      setField(ev.detail.data.field);
      storage().set("robot", `Robot_${ev.detail.data.robot}.glb`);
      loadRobotModel(
        `Robot_${ev.detail.data.robot}.glb`,
        robotProps[ev.detail.data.robot as keyof typeof robotProps]
      );
      setRobot(ev.detail.data.robot);
      storage().set("robotKey", unconfirmedRobotKey);
      setRobotKey(unconfirmedRobotKey);
    } else {
      setUnconfirmedRobotKey(robotKey);
    }
  }

  useEffect(() => {
    robotTopic?.unsubscribeAll();
    setRobotTopic(
      subscribe(
        robotKey,
        NetworkTablesTypeInfos.kDoubleArray,
        moveRobotCallback
      )
    );
  }, [robotKey, connected]);

  useEffect(() => {
    if (outAnimation.current === null) {
      outToolAnimation.current = createAnimation()
        .addElement(header.current!)
        .duration(130)
        .fromTo("transform", "translateY(0)", "translateY(-100%)");

      outAnimation.current = createAnimation()
        .addElement(document.querySelector("ion-tab-bar")!)
        .duration(130)
        .fromTo("transform", "translateY(0)", "translateY(100%)")
        .addAnimation(outToolAnimation.current);
    }
    if (inAnimation.current === null) {
      inToolAnimation.current = createAnimation()
        .addElement(header.current!)
        .duration(120)
        .fromTo("transform", "translateY(-100%)", "translateY(0)");

      inAnimation.current = createAnimation()
        .addElement(document.querySelector("ion-tab-bar")!)
        .duration(120)
        .fromTo("transform", "translateY(100%)", "translateY(0)")
        .addAnimation(inToolAnimation.current);
    }
  }, [header]);

  function bringToolsBack(e: MouseEvent) {
    if (
      e.clientY > window.innerHeight * 0.16 &&
      e.clientY < window.innerHeight * 0.84
    )
      return;
    inAnimation.current?.play();
    inAnimation.current?.onFinish(() => {
      inAnimation.current?.stop();
      header.current?.style.setProperty("transform", "translateY(0)");
      document
        .querySelector("ion-tab-bar")
        ?.style.setProperty("transform", "translateY(0)");
    });

    window.removeEventListener("click", bringToolsBack);
  }

  return (
    <IonPage>
      <IonHeader className="field-header" ref={header}>
        <IonToolbar>
          <IonTitle>3D Field</IonTitle>
          {/* Settings and Dismiss Button Icons */}
          <IonButtons slot="primary">
            <IonButton id="field-settings" fill="clear">
              <IonIcon className="field-buttons" icon={settingsOutline} />
            </IonButton>
          </IonButtons>
          <IonButtons slot="secondary">
            <IonButton
              fill="clear"
              onClick={() => {
                outAnimation.current?.onFinish(() => {
                  window.addEventListener("click", bringToolsBack);
                  outAnimation.current?.stop();
                  header.current?.style.setProperty(
                    "transform",
                    "translateY(-100%)"
                  );
                  document
                    .querySelector("ion-tab-bar")
                    ?.style.setProperty("transform", "translateY(100%)");
                });
                outAnimation.current?.play();
              }}
            >
              <IonIcon className="field-buttons" icon={chevronUpOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="field-page">
        <ThreeComponent />
        <IonModal
          ref={modal}
          trigger="field-settings"
          onWillDismiss={(ev) => onWillDismiss(ev)}
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>
                  Cancel
                </IonButton>
              </IonButtons>
              <IonTitle class="modal-title">3D Field Setup</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => confirm()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding field-settings">
            <IonItem lines="full">
              <IonSelect
                ref={fieldInput}
                interface="popover"
                label="Field"
                labelPlacement="stacked"
                value={field}
              >
                {fields.map((field) => (
                  <IonSelectOption
                    className="ion-no-padding"
                    key={field}
                    value={field}
                  >
                    {field}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem lines="full">
              <IonSelect
                ref={robotInput}
                interface="popover"
                label="Robot"
                labelPlacement="stacked"
                value={robot}
              >
                {robots.map((robot) => (
                  <IonSelectOption
                    className="ion-no-padding"
                    key={robot}
                    value={robot}
                  >
                    {robot}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem lines="full">
              <NTSelect
                initialValue={robotKey}
                onSelectionChange={(key) => {
                  setUnconfirmedRobotKey(key);
                }}
              />
            </IonItem>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default {
  path: "/field",
  displayName: "3D Field",
  icon: map,
  tab: "field",
  component: Page,
};
