import { useNoteStore } from "@/stores/note";
import { useRequest } from "./useRequest";
import { INote } from "@/types/INote";
import { useErrorNotification } from "./useUtils";

export class Note {
  static get store() {
    return useNoteStore();
  }

  static async my() {
    return await useRequest<INote[]>({
      url: "api/notes",
    }).then((response) => {
      this.store.notes = response.data;
    });
  }

  static async get(id: number) {
    return await useRequest<INote>({
      url: `api/notes/${id}`,
    }).then((response) => {
      return response.data;
    });
  }

  static async create(note: {
    title: string;
    description?: string;
    group_id: number;
  }) {
    return await useRequest<INote>({
      url: "api/notes",
      method: "post",
      body: {
        title: note.title,
        description: note.description,
        group_id: note.group_id ?? undefined,
      },
    })
      .then((response) => {
        this.store.notes.push(response.data);

        return true;
      })
      .catch((response) => {
        useErrorNotification(response.response.data);
        return false;
      });
  }

  static async update(
    id: INote["id"],
    note: { title?: string; description?: string; group_id: number },
  ) {
    return await useRequest<INote>({
      url: `api/notes/${id}`,
      method: "put",
      body: {
        title: note.title ?? undefined,
        description: note.description,
        group_id: note.group_id ?? undefined,
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

  static async destroy(id: INote["id"]) {
    return await useRequest<{ status: boolean }>({
      url: `api/notes/${id}`,
      method: "delete",
    }).then(() => {
      this.store.notes = this.store.notes.filter((item) => item.id != id);

      return true;
    });
  }
}
