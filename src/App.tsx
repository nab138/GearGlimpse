import {
  IonApp,
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonRouterOutlet,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  useIonPopover,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import NT4 from "./pages/NT4";
import Home from "./pages/Home";
import Field from "./pages/Field";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

import { home, map, settings, ellipsisHorizontal } from "ionicons/icons";

/* Theme variables */
import "./theme/variables.css";
import "./App.css";
import { useState } from "react";

setupIonicReact();

//const Popover = () => (
// <IonList>
//   <IonItem
//     button
//     onClick={() => {
//       //navigateToTab4();
//       // setShowPopover(false);
//     }}
//   >
//     <IonLabel>Tab 4</IonLabel>
//   </IonItem>
//   <IonItem
//     button
//     onClick={() => {
//       //navigateToTab5();
//       // setShowPopover(false);
//     }}
//   >
//     <IonLabel>Tab 5</IonLabel>
//   </IonItem>
// </IonList>
//   <IonContent>Hi</IonContent>
// );

const App: React.FC = () => {
  const Popover = () => (
    <IonContent className="ion-padding">Hello World!</IonContent>
  );
  const [present, dismiss] = useIonPopover(
    <IonContent className="ion-padding popover-content">
      Hello World!
    </IonContent>,
    {
      onDismiss: (data: any, role: string) => dismiss(data, role),
    }
  );
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Redirect exact path="/" to="/home" />
            <Route path="/home" render={() => <Home />} exact={true} />
            <Route path="/nt4" render={() => <NT4 />} exact={true} />
            <Route path="/field" render={() => <Field />} exact={true} />
          </IonRouterOutlet>

          <IonTabBar slot="bottom" mode="ios">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab="nt4" href="/nt4">
              <IonIcon icon={settings} />
              <IonLabel>NT4 Setup</IonLabel>
            </IonTabButton>

            <IonTabButton tab="field" href="/field">
              <IonIcon icon={map} />
              <IonLabel>3D Field</IonLabel>
            </IonTabButton>

            <IonTabButton>
              <IonIcon
                icon={ellipsisHorizontal}
                onClick={(e) => {
                  present({
                    event: e.nativeEvent,
                  });
                }}
                style={{
                  width: "100%",
                }}
              />
              <IonLabel>More</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
