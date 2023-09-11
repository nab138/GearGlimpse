import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
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

import { homeOutline, mapOutline, settingsOutline } from "ionicons/icons";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Redirect exact path="/" to="/home" />
            {/*
          Use the render method to reduce the number of renders your component will have due to a route change.

          Use the component prop when your component depends on the RouterComponentProps passed in automatically.
        */}
            <Route path="/home" render={() => <Home />} exact={true} />
            <Route path="/nt4" render={() => <NT4 />} exact={true} />
            <Route path="/field" render={() => <Field />} exact={true} />
            {/* <Route
              path="/library"
              render={() => <LibraryPage />}
              exact={true}
            />
            <Route path="/search" render={() => <SearchPage />} exact={true} /> */}
          </IonRouterOutlet>

          <IonTabBar slot="bottom" mode="ios">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton tab="nt4" href="/nt4">
              <IonIcon icon={settingsOutline} />
              <IonLabel>NT4 Setup</IonLabel>
            </IonTabButton>

            <IonTabButton tab="field" href="/field">
              <IonIcon icon={mapOutline} />
              <IonLabel>3D Field</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
