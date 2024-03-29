import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "me.nabdev.gearglimpse",
  appName: "GearGlimpse",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    LiveUpdates: {
      appId: "40e8d4f2",
      channel: "Production",
      autoUpdateMethod: "background",
      maxVersions: 2,
    },
  },
};

export default config;
