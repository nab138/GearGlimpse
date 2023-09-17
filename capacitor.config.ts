import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "me.nabdev.gearglimpse",
  appName: "GearGlimpse",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
