import { Storage } from '@ionic/storage';

const store = new Storage();

export async function init(){
    await store.create();
}

export default function getStorage(): Storage{
    return store;
}