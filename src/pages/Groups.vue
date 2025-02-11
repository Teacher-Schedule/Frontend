<script setup lang="ts">
import { onMounted, ref } from "vue";
import GroupsModal from "@/components/Groups/Modal.vue";
import GroupsList from "@/components/Groups/List.vue";
import { Group } from "@/composables/useGroup";
import { useHead } from "@vueuse/head";

const createGroupModal = ref(false);
const groupLoading = ref(true);

onMounted(async () => {
  await Group.my();
  groupLoading.value = false;
});

useHead({
  title: "Группы",
});
</script>

<template>
  <div>
    <h1 class="text-2xl text-center">Группы</h1>

    <div class="mt-3 flex justify-end">
      <v-btn @click="createGroupModal = true" color="primary">
        + Создать группу
      </v-btn>

      <GroupsModal
        :dialog="createGroupModal"
        @dialog="(e) => (createGroupModal = e)"
      />
    </div>

    <div v-if="groupLoading" class="justify-center flex">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </div>
    <div v-else>
      <GroupsList />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
