import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Setup from "./pages/Setup";
import tabs from "./pages/tabs";

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

import { settings } from "ionicons/icons";

/* Theme variables */
import "./theme/variables.css";
import "./App.css";
import { useEffect, useState } from "react";
import storage from "./utils/storage";

setupIonicReact({
  mode: "ios",
});

const App: React.FC = () => {
  const [focusedTab, setFocusedTab] = useState("Docs");
  const [addedTabs, setAddedTabs] = useState(["Docs"]);
  useEffect(() => {
    (async () => {
      let tabs = await storage().get("tabs");
      if (tabs == undefined) {
        tabs = ["Docs", "3D Field"];
        await storage().set("tabs", tabs);
      }
      setAddedTabs(tabs);
    })();
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      // Extract the tab name from the path and set it as the focused tab
      const tab = path.split("/")[1]; // Adjust this based on your URL structure
      setFocusedTab(tab);
    };

    // Call the function once to set the initial tab
    handleLocationChange();

    // Listen for changes in the URL
    window.addEventListener("popstate", handleLocationChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs
          className="tab-bar"
          onIonTabsWillChange={(e) => {
            setFocusedTab(e.detail.tab);
          }}
        >
          <IonRouterOutlet>
            <Redirect exact path="/" to="/docs" />
            <Route
              path="/setup"
              render={() => (
                <Setup setTabs={setAddedTabs} selectedTabs={addedTabs} />
              )}
              exact={true}
            />
            {
              // Add a route for every tab in the tabs array
              tabs.map((tab) => (
                <Route
                  key={tab.path}
                  path={tab.path}
                  render={() => (
                    <tab.component focused={focusedTab === tab.tab} />
                  )}
                  exact={true}
                />
              ))
            }
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            {
              // Add a tab for every tab in the tabs array
              addedTabs.map((tabString) => {
                // Find the tab object that matches the tab string
                let tab = tabs.find((tab) => tab.displayName == tabString);
                if (tab == undefined) {
                  return <></>;
                }
                return (
                  <IonTabButton key={tab.path} tab={tab.tab} href={tab.path}>
                    <IonIcon icon={tab.icon} />
                    <IonLabel>{tab.displayName}</IonLabel>
                  </IonTabButton>
                );
              })
            }

            <IonTabButton tab="setup" href="/setup">
              <IonIcon icon={settings} />
              <IonLabel>Setup</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
