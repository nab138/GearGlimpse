import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams } from "react-router";
import "./Home.css";

const Page: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Centered gretting text */}
        <div className="home-container">
          <h1>Welcome to FRC-iOS</h1>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Page;
