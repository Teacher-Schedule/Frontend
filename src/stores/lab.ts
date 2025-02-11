import { ILab } from "@/types/ILab";
import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const useLabStore = defineStore("lab", () => {
  let labs: Ref<ILab[]> = ref([]);

  return {
    labs,
  };
});
