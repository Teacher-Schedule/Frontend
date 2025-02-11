<script setup lang="ts">
import { Note } from "@/composables/useNote";
import NotesItem from "@/components/Notes/Item.vue";
</script>

<template>
  <div v-if="Note.store.notes.length > 0">
    <v-expansion-panels class="my-4" variant="inset">
      <NotesItem v-for="note in Note.store.notes" :note="note" :key="note.id" />
    </v-expansion-panels>
  </div>
  <div v-else class="flex justify-center">
    <h3 class="text-xl">У вас пока нет заметок</h3>
  </div>
</template>

<style scoped lang="scss"></style>
