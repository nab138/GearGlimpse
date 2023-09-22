import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
  } from "@ionic/react";
  import "./Graph.css";
import { barChart } from "ionicons/icons";
  
  const Page: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Graph</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {/* Centered gretting text */}
          <div className="home-container">
            <h1>Line Graph</h1>
            <p>Coming soon</p>
          </div>
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