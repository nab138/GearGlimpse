import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Docs.css";
import { book } from "ionicons/icons";
import { TabProps } from ".";

const Page: React.FC<TabProps> = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Docs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {/* Centered gretting text */}
        <div className="top-docs-container">
          <h1>Welcome to GearGlimpse</h1>
          <p>⚠️ Docs are a WIP, and may be incomplete. ⚠️</p>
        </div>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Getting Started</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Visit the "Setup" tab in the bottom left to configure your tabs and
            set up NT4. Most tabs have extra options available by clicking the
            gear icon in the top right.
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Graph Tab</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            The graph tab is a little buggy right now, there are a few things to
            note (some of these may change in the future):
            <ul>
              <li>
                It's possible to zoom way too far out or too far in currently.
                As a workaround, you can reset your zoom by going to a different
                tab then back to the graph tab.
              </li>
              <li>
                Data is delted from the graph as soon as it goes offscreen, even
                if you try to zoom out to see it again.
              </li>
              <li>
                There is a small delay between the value changing and it
                appearing on the graph.
              </li>
              <li>
                The timestamps are based on when the value was received by
                GearGlimpse, not when it was set on the server, so there may be
                inaccuracies.
              </li>
            </ul>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default {
  path: "/docs",
  displayName: "Docs",
  icon: book,
  tab: "docs",
  component: Page,
};
