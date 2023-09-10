import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import "./NT4.css";
import { NetworkTables } from "ntcore-ts-client";

const Page: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name={name} />
      </IonContent> */}
      {/* Input field and button to connect to nt4*/}
      <IonHeader>
        <IonToolbar>
          <IonTitle>NT4</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <input
          type="text"
          className="form-control"
          placeholder="IP Address"
          id="ip"
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            NetworkTables.getInstanceByURI(
              (document.getElementById("ip") as HTMLInputElement).value
            );
          }}
        >
          Connect to NT
        </button>
      </IonContent>
    </IonPage>
  );
};

export default Page;
