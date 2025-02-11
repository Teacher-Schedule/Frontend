<script setup lang="ts">
import { onMounted, ref } from "vue";
import NotesList from "@/components/Notes/List.vue";
import NotesModal from "@/components/Notes/Modal.vue";
import { useHead } from "@vueuse/head";
import { Note } from "@/composables/useNote";

const createNoteModal = ref(false);
const noteLoading = ref(true);

onMounted(async () => {
  await Note.my();
  noteLoading.value = false;
});

useHead({
  title: "Группы",
});
</script>

<template>
  <div>
    <h1 class="text-2xl text-center">Заметки</h1>

    <div class="mt-3 flex justify-end">
      <v-btn @click="createNoteModal = true" color="primary">
        + Создать заметку
      </v-btn>
    </div>

    <NotesModal
      :dialog="createNoteModal"
      @update-dialog="(e: boolean) => (createNoteModal = e)"
    />
    <div v-if="noteLoading" class="justify-center flex">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </div>
    <div v-else>
      <NotesList />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
