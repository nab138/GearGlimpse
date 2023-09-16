import {
  NetworkTables,
  NetworkTablesTopic,
  NetworkTablesTypeInfo,
  NetworkTablesTypeInfos,
  NetworkTablesTypes,
} from "ntcore-ts-client";

let client: NetworkTables | null = null;

export function connectURI(address: string, port: number) {
  if (client != null) {
    client.changeURI(address, port);
  } else {
    client = NetworkTables.getInstanceByURI(address, port);
  }
}

export function connectTeamNumber(teamNumber: number, port: number) {
  if (client != null) {
    client.changeURI(getRobotAddress(teamNumber), port);
  } else {
    client = NetworkTables.getInstanceByTeam(teamNumber, port);
  }
}

export function subscribe<T extends NetworkTablesTypes>(
  key: string,
  typeInfo: NetworkTablesTypeInfo,
  callback: (value: any) => void
) {
  let topic = client?.createTopic<T>(key, typeInfo);

  // Subscribe and immediately call the callback with the current value
  topic?.subscribe(callback, true, {
    periodic: 0.001,
  });

  return topic;
}

export function unsubscribe(topic: NetworkTablesTopic<any>) {
  topic.unsubscribeAll();
}

function getRobotAddress(team: number) {
  return "roborio-".concat(team.toString(), "-frc.local");
}
