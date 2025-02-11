<script setup lang="ts">
import { Group } from "@/composables/useGroup";
import { IGroup } from "@/types/IGroup";
import { RouterLink } from "vue-router";

defineProps<{
  group: IGroup;
}>();
</script>

<template>
  <v-expansion-panel>
    <template #title>
      <div class="flex gap-3 items-center">
        {{ group.title }}
        <RouterLink
          :to="{
            name: 'group',
            params: {
              id: group.id,
            },
          }"
          ><v-icon icon="mdi-open-in-new"></v-icon
        ></RouterLink>
      </div>
    </template>
    <template #text>
      <div class="flex justify-between items-center">
        <div>
          <div>Кол-во студентов: {{ group.students.length }}</div>
          <div>Кол-во работ: {{ group.labs.length }}</div>
        </div>
        <div>
          <v-btn
            variant="outlined"
            @click="Group.destroy(group.id)"
            color="red"
          >
            Удалить
          </v-btn>
        </div>
      </div>
    </template>
  </v-expansion-panel>
</template>

<style scoped lang="scss"></style>
