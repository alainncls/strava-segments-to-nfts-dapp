// Inspired from https://gist.github.com/aignermax/c495c98003da974d17b9c4c481ac23be

import { Metadata } from "../types";

export interface IpfsData {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
}

export interface IpfsError {
  Message: string;
  Code: number;
  Type: string;
}

export type IpfsDataOrError = IpfsData | IpfsError;

function isIpfsData(toBeDetermined: IpfsDataOrError): toBeDetermined is IpfsData {
  return !!(toBeDetermined as IpfsData).IpfsHash;
}

export async function uploadToIPFS(data: Blob | Metadata | string): Promise<string> {
  const formData = new FormData();
  if ((data as Metadata).name) {
    formData.append("file", data as Blob, (data as Metadata).name);
  } else {
    formData.append("file", data as Blob);
  }

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_PINATA_API_JWT}`,
    },
    body: formData,
  });

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch (err) {
    console.error(err);
  }

  if (isIpfsData(json)) {
    return "ipfs://" + json.IpfsHash;
  } else if ((json as IpfsError).Message) {
    console.error(json.Message);
    throw new Error(json.Message);
  } else {
    console.error("Error parsing result" + text);
    throw new Error("Error parsing result " + text);
  }
}
