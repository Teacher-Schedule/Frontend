<script setup lang="ts">
import { Ref, ref } from "vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import NotesModal from "@/components/Notes/Modal.vue";

import MarkdownPreview from "@uivjs/vue-markdown-preview";
import "@uivjs/vue-markdown-preview/markdown.css";
import { INote } from "@/types/INote";
import { useHead } from "@vueuse/head";
import { Note } from "@/composables/useNote";

const currentNote: Ref<INote | null> = ref(null);
const route = useRoute();
const editNoteDialog = ref(false);
let options = {
  month: "long",
  day: "numeric",
  timezone: "UTC",
  hour: "numeric",
  minute: "numeric",
};
onMounted(async () => {
  await getNote();
  useHead({
    title: `Группа: ${currentNote.value?.title}`,
  });
});

const getNote = async () => {
  currentNote.value = await Note.get(Number(route.params.id));
};
</script>

<template>
  <div v-if="currentNote">
    <h1 class="text-2xl text-center mb-4">{{ currentNote.title }}</h1>
    <markdown-preview class="markdown-wrapper">
      {{ currentNote?.description }}
    </markdown-preview>
    <div class="text-gray-500 mt-4" v-if="currentNote.group">
      <RouterLink
        :to="{
          name: 'group',
          params: {
            id: currentNote.group.id,
          },
        }"
      >
        Группа: {{ currentNote.group.title }}
      </RouterLink>
    </div>
    <div class="flex justify-between center mt-5 text-gray-500">
      <div>
        <div
          class="text-violet-500 cursor-pointer"
          @click="editNoteDialog = true"
        >
          Редактировать
        </div>
      </div>
      <div class="text-right">
        <div>
          Заметка создана:
          {{
            //@ts-ignore
            new Date(currentNote?.created_at).toLocaleString("ru", options)
          }}
        </div>
      </div>
    </div>

    <NotesModal
      :dialog="editNoteDialog"
      :note="currentNote"
      @update-dialog="(e: boolean) => (editNoteDialog = e)"
    />
  </div>
</template>

<style scoped lang="scss"></style>
