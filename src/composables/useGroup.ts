import { useGroupStore } from "@/stores/group";
import { useRequest } from "./useRequest";
import { IGroup } from "@/types/IGroup";
import { useErrorNotification } from "./useUtils";

export class Group {
  static get store() {
    return useGroupStore();
  }

  static async my() {
    return await useRequest<IGroup[]>({
      url: "api/groups",
    }).then((response) => {
      this.store.groups = response.data;
    });
  }

  static async get(id: number) {
    return await useRequest<IGroup>({
      url: `api/groups/${id}`,
    }).then((response) => {
      return response.data;
    });
  }

  static async create(group: { title: string; lab_ids?: number[] }) {
    return await useRequest<IGroup>({
      url: "api/groups",
      method: "post",
      body: {
        title: group.title,
        lab_ids: group.lab_ids ?? [],
      },
    })
      .then((response) => {
        this.store.groups.push(response.data);

        return true;
      })
      .catch((response) => {
        useErrorNotification(response.response.data);
        return false;
      });
  }

  static async update(
    id: IGroup["id"],
    group: { title?: string; lab_ids?: number[] },
  ) {
    return await useRequest<IGroup>({
      url: `api/groups/${id}`,
      method: "put",
      body: {
        title: group.title ?? undefined,
        lab_ids: group.lab_ids ?? [],
      },
    })
      .then(() => {
        this.my();

        return true;
      })
      .catch((response) => {
        useErrorNotification(response.response.data);
        return false;
      });
  }

  static async destroy(id: IGroup["id"]) {
    return await useRequest<{ status: boolean }>({
      url: `api/groups/${id}`,
      method: "delete",
    }).then(() => {
      this.store.groups = this.store.groups.filter((item) => item.id != id);

      return true;
    });
  }
}
