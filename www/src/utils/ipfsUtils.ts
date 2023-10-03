// Taken from https://gist.github.com/aignermax/c495c98003da974d17b9c4c481ac23be

import { Metadata } from "../types";

export const IPFSGateways = {
  InfuraGateway: "https://ipfs.io/ipfs/",
  YourDedicatedGateway: import.meta.env.VITE_INFURA_IPFS_GATEWAY || "https://ipfs.io/ipfs/",
}; // if you have your own gateway, you can use it here
const projectId = import.meta.env.VITE_INFURA_IPFS_ID; // <---------- your Infura Project ID - You should never have your keys in the frontend,
// so you might have to find a way to deliver those keys from some kind of backend.
const projectSecret = import.meta.env.VITE_INFURA_IPFS_SECRET; // Infura Secret - should never be on the real client

export interface IpfsData {
  Name: string;
  Hash: string;
}

export interface IpfsError {
  Message: string;
  Code: number;
  Type: string; // this just states "error"
}

export type IpfsDataOrError = IpfsData | IpfsError;

export async function uploadToIPFS(data: Blob | Metadata | string): Promise<string> {
  const result = await callIpfsCommand("add", data);
  return "ipfs://" + result.Hash;
}

function isIpfsData(toBeDetermined: IpfsDataOrError): toBeDetermined is IpfsData {
  return !!(toBeDetermined as IpfsData).Hash;
}

async function callIpfsCommand(args: string, data: Blob | Metadata | string): Promise<IpfsData> {
  const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
  const formData = new FormData();
  if ((data as Metadata).name) {
    formData.append("file", data as Blob, (data as Metadata).name);
  } else {
    formData.append("file", data as Blob);
  }

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
    mode: "cors",
    body: formData,
  } as RequestInit;

  const res = await fetch("https://ipfs.infura.io:5001/api/v0/" + args, options);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error(err);
  }

  if (isIpfsData(json)) {
    return json;
  } else if ((json as IpfsError).Message) {
    throw new Error(json.Message);
  } else {
    throw new Error("error parsing result " + text);
  }
}
