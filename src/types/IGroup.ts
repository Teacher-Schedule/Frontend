import { ILab } from "./ILab";
import { IStudent } from "./IStudent";

export interface IGroup {
  id: number;
  title: string;
  user_id: number;
  labs: ILab[];
  lab_ids: ILab["id"][];
  students: IStudent[];
  created_at: string;
  updated_at: string;
}
