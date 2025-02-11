import { IGroup } from "@/types/IGroup";
import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const useGroupStore = defineStore("group", () => {
  let groups: Ref<IGroup[]> = ref([]);

  return {
    groups,
  };
});
