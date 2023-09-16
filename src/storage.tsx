import { Storage } from "@ionic/storage";

const store = new Storage();
let hasInit = false;

export default function getStorage(): Storage {
  if (!hasInit) {
    store.create();
    hasInit = true;
  }
  return store;
}
