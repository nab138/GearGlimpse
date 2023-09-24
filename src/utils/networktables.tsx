import { list } from "ionicons/icons";
import {
  NetworkTables,
  NetworkTablesTypeInfo,
  NetworkTablesTypeInfos,
  NetworkTablesTypes,
} from "ntcore-ts-client";
import { useState } from "react";

let client: NetworkTables | null = null;
export const listenerStates: ((_: string) => void)[] = [];

export function connectURI(address: string, port: number) {
  if (client != null) {
    client.changeURI(address, port);
  } else {
    client = NetworkTables.getInstanceByURI(address, port);
    loadAllTopics();
    client.addRobotConnectionListener((isConnected) => {
      for (let listener of listenerStates) {
        listener(isConnected ? "Connected" : "Searching");
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
      for (let listener of listenerStates) {
        listener(isConnected ? "Connected" : "Searching");
      }
    });
  }
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
