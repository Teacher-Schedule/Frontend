import { IGroup } from "./IGroup";

export interface ILab {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  groups: IGroup[];
  group_ids: IGroup["id"][];
  pivot: {
    group_id: number;
    lab_id: number;
  };
}
