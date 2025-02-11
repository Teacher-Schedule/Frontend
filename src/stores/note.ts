import { INote } from "@/types/INote";
import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const useNoteStore = defineStore("note", () => {
  let notes: Ref<INote[]> = ref([]);

  return {
    notes,
  };
});
