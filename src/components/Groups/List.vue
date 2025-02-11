<script setup lang="ts">
import { Group } from "@/composables/useGroup";
import GroupsItem from "@/components/Groups/Item.vue";
</script>

<template>
  <div v-if="Group.store.groups.length > 0">
    <v-expansion-panels class="my-4" variant="inset">
      <GroupsItem
        v-for="group in Group.store.groups"
        :group="group"
        :key="group.id"
      />
    </v-expansion-panels>
  </div>
  <div v-else class="flex justify-center">
    <h3 class="text-xl">У вас пока нет групп</h3>
  </div>
</template>

<style scoped lang="scss"></style>
