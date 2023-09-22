// New react component that takes in two arrays for props called BulkSelect

import { addCircle, removeCircle } from "ionicons/icons";
import {
  IonCard,
  IonIcon,
  IonItem,
  IonReorder,
  IonReorderGroup,
  IonTitle,
} from "@ionic/react";
import "./BulkSelect.css";
interface BulkSelectProps {
  items: string[];
  selectedItems: string[];
  onChange?: (items: string[]) => void;
  setSelectedItems: (items: string[]) => void;
  maxItems?: number;
  minItems?: number;
}

export default function BulkSelect(props: BulkSelectProps) {
  return (
    <>
      <IonCard className="bulk-select-group bulk-select-selected">
        <IonReorderGroup
          disabled={false}
          onIonItemReorder={(e) => {
            let newItems = e.detail.complete(props.selectedItems);

            props.setSelectedItems(newItems);
            if (props.onChange) {
              props.onChange(newItems);
            }
          }}
        >
          {/* All current selected items should be in this list and have a red minus to be able to remove */}
          {props.selectedItems.map((item) => (
            <IonItem key={item}>
              <IonIcon
                slot="start"
                icon={removeCircle}
                className={
                  props.minItems && props.selectedItems.length <= props.minItems
                    ? ""
                    : "remove-icon"
                }
                onClick={() => {
                  if (
                    props.minItems &&
                    props.selectedItems.length <= props.minItems
                  ) {
                    return;
                  }
                  let newItems = props.selectedItems.filter((i) => i != item);
                  props.setSelectedItems(newItems);
                  if (props.onChange) {
                    props.onChange(newItems);
                  }
                }}
              />
              <IonTitle className="tab-title ion-no-padding">{item}</IonTitle>
              <IonReorder slot="end" />
            </IonItem>
          ))}
          {/* All current unselected items should be in this list and have a green plus to be able to add */}
        </IonReorderGroup>
      </IonCard>
      <IonCard className="bulk-select-unselected bulk-select-group ion-no-padding">
        {props.items
          .filter((item) => !props.selectedItems.includes(item))
          .map((item) => (
            <IonItem key={item}>
              <IonIcon
                slot="start"
                icon={addCircle}
                className={
                  props.maxItems && props.selectedItems.length >= props.maxItems
                    ? ""
                    : "add-icon"
                }
                onClick={() => {
                  if (
                    props.maxItems &&
                    props.selectedItems.length >= props.maxItems
                  ) {
                    return;
                  }
                  props.setSelectedItems([...props.selectedItems, item]);
                  if (props.onChange) {
                    props.onChange([...props.selectedItems, item]);
                  }
                }}
              />
              <IonTitle className="tab-title ion-no-padding">{item}</IonTitle>
            </IonItem>
          ))}
      </IonCard>
    </>
  );
}
