import { useLabStore } from "@/stores/lab";
import { useRequest } from "./useRequest";
import { ILab } from "@/types/ILab";

export class Lab {
  static get store() {
    return useLabStore();
  }

  static async getAll() {
    return await useRequest<ILab[]>({
      url: "api/labs",
    }).then((response) => {
      this.store.labs = response.data;
    });
  }
  static async create(params: { title: string }) {
    return await useRequest<ILab>({
      url: "api/labs",
      method: "post",
      body: {
        title: params.title,
      },
    }).then((response) => {
      this.store.labs.push(response.data);
    });
  }
}
