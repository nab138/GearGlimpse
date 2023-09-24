import React, { useRef, useState } from "react";
import { IonButton, IonItem, IonModal } from "@ionic/react";
import NetworkTablesTypeahead from "./NetworkTablesTypeahead";
import "./NTSelect.css";

interface NTSelectProps {
  title?: string;
  initialValue?: string;
  onSelectionChange?: (item: string) => void;
}

function NTSelect(props: NTSelectProps) {
  const modal = useRef<HTMLIonModalElement>(null);
  let initialValue = props.initialValue;
  if (initialValue == undefined || initialValue == null || initialValue == "") {
    initialValue = "Select NT Key";
  }

  const [buttonText, setButtonText] = useState<string>(initialValue);

  return (
    <>
      {/* Ion button styled like a regular input */}
      <div
        className="nt-select-button"
        onClick={() => modal.current?.present()}
      >
        {buttonText}
      </div>
      <IonModal ref={modal}>
        <NetworkTablesTypeahead
          title={props.title ?? "Select NT Key"}
          onSelectionCancel={() => {
            modal.current?.dismiss();
          }}
          onSelectionChange={(item) => {
            setButtonText(item);
            modal.current?.dismiss();
            props.onSelectionChange?.(item);
          }}
        />
      </IonModal>
    </>
  );
}
export default NTSelect;
