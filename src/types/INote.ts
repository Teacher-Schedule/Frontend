import { IGroup } from "./IGroup";

export interface INote {
  id: number;
  title: string;
  description: string;
  group: IGroup;
  group_id: number;
  created_at: string;
  updated_at: string;
}

export interface ICreateNote {
  id?: number;
  title: string;
  description: string;
  group_id: number | null;
}
