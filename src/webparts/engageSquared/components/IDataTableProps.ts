import { ITFLData } from "../data/ITFLData";
import { DataTypeOption } from "./DataTypeOption";

export interface IDataTableProps {
  dataType: DataTypeOption;
  data: ITFLData[];
  onSelectionChange?: (e: Object, item: ITFLData) => void;
}
