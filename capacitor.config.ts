import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "me.nabdev.frcios",
  appName: "FRC-iOS",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
