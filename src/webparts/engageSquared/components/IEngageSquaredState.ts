import { ITFLData } from "../data/ITFLData";
import { DataTypeOption } from "./DataTypeOption";

export interface IEngageSquaredState {
  isLoading: boolean;
  dataType: DataTypeOption;
  pins: any[];
  data: ITFLData[];
  center: number[];
  zoom: number;
}
