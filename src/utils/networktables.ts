import {
  NetworkTables,
  NetworkTablesTypeInfo,
  NetworkTablesTypes,
} from "ntcore-ts-client";

let client: NetworkTables | null = null;

export function connectURI(address: string, port: number) {
  if (client != null) {
    client.changeURI(address, port);
  } else {
    client = NetworkTables.getInstanceByURI(address, port);
  }
  //loadAllTopics();
}

export function connectTeamNumber(teamNumber: number, port: number) {
  if (client != null) {
    client.changeURI(getRobotAddress(teamNumber), port);
  } else {
    client = NetworkTables.getInstanceByTeam(teamNumber, port);
  }
  //loadAllTopics();
}

export function subscribe<T extends NetworkTablesTypes>(
  key: string,
  typeInfo: NetworkTablesTypeInfo,
  callback: (value: any) => void
) {
  let topic = client?.createTopic<T>(key, typeInfo);

  topic?.subscribe(callback, true, {
    periodic: 0.001,
  });

  return topic;
}

export function connectionStatus() {
  if (client == null) {
    return "Disconnected";
  }
  if (client.isRobotConnected()) {
    return "Connected";
  }
  return "Searching";
}

export function getEntryList() {
  //return client?.client.getTopicNames();
}

function getRobotAddress(team: number) {
  return "roborio-".concat(team.toString(), "-frc.local");
}

// function loadAllTopics() {
//   let topic = client?.createTopic<string>("/", NetworkTablesTypeInfos.kString);

//   topic?.subscribe(
//     () => {},
//     false,
//     {
//       periodic: 1,
//       topicsonly: true,
//       prefix: true,
//     },
//     undefined,
//     false
//   );

//   setTimeout(() => {
//     topic?.unsubscribeAll();
//   }, 1200);
// }
