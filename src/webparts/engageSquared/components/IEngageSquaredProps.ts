import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IEngageSquaredProps {
  context: WebPartContext;
  bingMapsApiKey: string;
  tflApiPath: string;
}
