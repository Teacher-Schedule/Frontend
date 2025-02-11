<script setup lang="ts">
import { Note } from "@/composables/useNote";
import { INote } from "@/types/INote";
import { marked } from "marked";
import { ref } from "vue";
import { RouterLink } from "vue-router";
import NotesModal from "@/components/Notes/Modal.vue";

defineProps<{
  note: INote;
}>();

const editNoteDialog = ref(false);
</script>

<template>
  <v-expansion-panel>
    <template #title>
      <div class="flex gap-3 items-center">
        {{ note.title }}
        <RouterLink
          :to="{
            name: 'note',
            params: {
              id: note.id,
            },
          }"
          ><v-icon icon="mdi-open-in-new"></v-icon
        ></RouterLink>
      </div>
    </template>
    <template #text>
      <div class="flex justify-between items-center">
        <div>
          <div class="flex gap-3" v-if="note.group">
            Группа: {{ note.group.title }}

            <RouterLink
              :to="{
                name: 'group',
                params: {
                  id: note.group.id,
                },
              }"
              ><v-icon icon="mdi-open-in-new"></v-icon
            ></RouterLink>
          </div>
          <div class="mt-4">
            <p>Текст заметки:</p>
            <div v-html="marked(note.description.slice(0, 200) + '...')"></div>
          </div>
        </div>
        <div class="grid gap-4">
          <v-btn
            variant="outlined"
            @click="editNoteDialog = true"
            color="primary"
          >
            Редактировать
          </v-btn>
          <v-btn variant="outlined" @click="Note.destroy(note.id)" color="red">
            Удалить
          </v-btn>
          <NotesModal
            :dialog="editNoteDialog"
            :note="note"
            @update-dialog="(e: boolean) => (editNoteDialog = e)"
          />
        </div>
      </div>
    </template>
  </v-expansion-panel>
</template>

<style scoped lang="scss"></style>
