import React, { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonSearchbar,
  IonToolbar,
} from "@ionic/react";
import type { CheckboxCustomEvent } from "@ionic/react";
import { getTopicList } from "../utils/networktables";

interface TypeaheadProps {
  title?: string;
  onSelectionCancel?: () => void;
  onSelectionChange?: (item: string) => void;
}

function NetworkTablesTypeahead(props: TypeaheadProps) {
  let items = getTopicList();

  const [filteredItems, setFilteredItems] = useState<string[]>([...items]);

  const cancelChanges = () => {
    const { onSelectionCancel } = props;
    if (onSelectionCancel !== undefined) {
      onSelectionCancel();
    }
  };

  const confirmChanges = (value: string) => {
    const { onSelectionChange } = props;
    if (onSelectionChange !== undefined) {
      // TODO: Implement
      onSelectionChange(value);
    }
  };

  const searchbarInput = (ev: any) => {
    filterList(ev.target.value);
  };

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  const filterList = (searchQuery: string | null | undefined) => {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined || searchQuery === null) {
      setFilteredItems([...items]);
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      setFilteredItems(
        items.filter((item) => {
          return item.toLowerCase().includes(normalizedQuery);
        })
      );
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={cancelChanges}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>{props.title}</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar onIonInput={searchbarInput}></IonSearchbar>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        <IonList id="modal-list" inset={true}>
          {filteredItems.map((item) => (
            <IonItem key={item} onClick={() => confirmChanges(item)}>
              {item}
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </>
  );
}
export default NetworkTablesTypeahead;
