import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import "./Settings.css";

import React, { useRef } from "react";
import storage from "../../utils/storage";
import NTSelect from "../NTSelect";
import { fields, robots } from "../../pages/tabs/Field";

export interface SettingsProps {
  modal: React.RefObject<HTMLIonModalElement>;
  unconfirmedField: string;
  setUnconfirmedField: (field: string) => void;
  unconfirmedRobot: string;
  setUnconfirmedRobot: (robot: string) => void;
  setUnconfirmedRobotKey: (key: string) => void;
  robotKey: string;
  unconfirmedStatsEnabled: boolean;
  setUnconfirmedStatsEnabled: (enabled: boolean) => void;
  unconfirmedCinematicMode: boolean;
  setUnconfirmedCinematicMode: (enabled: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({
  modal,
  unconfirmedField,
  setUnconfirmedField,
  unconfirmedRobot,
  setUnconfirmedRobot,
  setUnconfirmedRobotKey,
  robotKey,
  unconfirmedStatsEnabled,
  setUnconfirmedStatsEnabled,
  unconfirmedCinematicMode,
  setUnconfirmedCinematicMode,
}) => {
  const fieldInput = useRef<HTMLIonSelectElement>(null);
  const robotInput = useRef<HTMLIonSelectElement>(null);

  function confirm() {
    modal.current?.dismiss(
      {
        field: fieldInput.current?.value,
        robot: robotInput.current?.value,
      },
      "confirm"
    );
  }

  return (
    <>
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
        <IonItemGroup>
          <IonLabel>Field Setup</IonLabel>
          <IonItem lines="full">
            <IonSelect
              ref={fieldInput}
              interface="popover"
              label="Field"
              labelPlacement="stacked"
              value={unconfirmedField}
              onIonChange={(e) => setUnconfirmedField(e.detail.value)}
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
              value={unconfirmedRobot}
              onIonChange={(e) => setUnconfirmedRobot(e.detail.value)}
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
            <IonToggle
              checked={unconfirmedCinematicMode}
              onIonChange={(e) => {
                setUnconfirmedCinematicMode(e.detail.checked);
              }}
            >
              Cinematic Mode
            </IonToggle>
          </IonItem>
        </IonItemGroup>
        <IonItemGroup className="ion-padding-top">
          <IonLabel>Network Tables</IonLabel>
          <IonItem lines="full">
            <NTSelect
              initialValue={robotKey}
              onSelectionChange={(key) => {
                setUnconfirmedRobotKey(key);
              }}
            />
          </IonItem>
        </IonItemGroup>
        <IonItemGroup className="ion-padding-top">
          <IonLabel>Extras</IonLabel>
          <IonItem lines="full">
            <IonToggle
              checked={unconfirmedStatsEnabled}
              onIonChange={(e) => {
                setUnconfirmedStatsEnabled(e.detail.checked);
              }}
            >
              Show Stats
            </IonToggle>
          </IonItem>
        </IonItemGroup>
      </IonContent>
    </>
  );
};

export default Settings;
