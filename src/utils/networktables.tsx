import {
  NetworkTables,
  NetworkTablesTopic,
  NetworkTablesTypeInfo,
  NetworkTablesTypeInfos,
  NetworkTablesTypes,
} from "ntcore-ts-client-monorepo/packages/ntcore-ts-client/src/index";

let client: NetworkTables | null = null;
export const listenerStates: ((_: string) => void)[] = [];

export const lastTopicValues = new Map<NetworkTablesTopic<any>, any>();

let connectedTime = 0;

let wasConnected = false;
export function connectURI(address: string, port: number) {
  if (client != null) {
    client.changeURI(address, port);
  } else {
    client = NetworkTables.getInstanceByURI(address, port);
    loadAllTopics();
    client.addRobotConnectionListener((isConnected) => {
      if (wasConnected == isConnected) return;
      wasConnected = isConnected;
      for (let listener of listenerStates) {
        listener(isConnected ? "Connected" : "Searching");
      }
      if (isConnected) {
        connectedTime = Date.now() / 1000;
      }
    });
  }
}

export function connectTeamNumber(teamNumber: number, port: number) {
  if (client != null) {
    client.changeURI(getRobotAddress(teamNumber), port);
  } else {
    client = NetworkTables.getInstanceByTeam(teamNumber, port);
    loadAllTopics();
    client.addRobotConnectionListener((isConnected) => {
      if (wasConnected == isConnected) return;
      wasConnected = isConnected;
      for (let listener of listenerStates) {
        listener(isConnected ? "Connected" : "Searching");
      }
    });
  }
}

export function subscribe<T extends NetworkTablesTypes>(
  key: string,
  typeInfo: NetworkTablesTypeInfo,
  callback: (value: any) => void,
  periodic: number = 0.001
) {
  let topic = client?.createTopic<T>(key, typeInfo);

  topic?.subscribe(callback, true, {
    periodic,
  });

  return topic;
}

export function subscribeWithStoring<T extends NetworkTablesTypes>(
  key: string,
  typeInfo: NetworkTablesTypeInfo,
  periodic: number = 0.01
) {
  let topic = client?.createTopic<T>(key, typeInfo);

  topic?.subscribe(
    (value) => {
      lastTopicValues.set(topic!, value);
    },
    true,
    {
      periodic,
    }
  );

  return topic;
}

export function getClient() {
  return client;
}

function getRobotAddress(team: number) {
  return "roborio-".concat(team.toString(), "-frc.local");
}

export function getTopicList() {
  if (client == null) return [];
  return client.client.getTopicNames();
}

export function getServerTime() {
  return client?.client.messenger.socket.getServerTime();
}
function loadAllTopics() {
  let topic = client?.createTopic<string>("/", NetworkTablesTypeInfos.kString);

  let id = topic?.subscribe(
    (value) => {
      console.log(value);
    },
    true,
    {
      periodic: 1,
      topicsonly: true,
      prefix: true,
    },
    undefined,
    false
  );

  topic?.unsubscribe(id!);
}
