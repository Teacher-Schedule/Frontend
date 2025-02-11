<script setup lang="ts">
import { Ref, ref, watch } from "vue";
import { onMounted } from "vue";
import { ICreateNote } from "@/types/INote";
import { Group } from "@/composables/useGroup";
import { Note } from "@/composables/useNote";

const props = defineProps<{
  dialog: boolean;
  note?: ICreateNote | null;
}>();
const emits = defineEmits(["update-dialog"]);
const dialog = ref(props.dialog);

watch(
  () => props.dialog,
  (value) => {
    dialog.value = value;
  },
);
watch(dialog, (value) => {
  if (!value) {
    note.value = {
      title: "",
      description: "",
      group_id: null,
    };
  }
  emits("update-dialog", value);
});

const note: Ref<ICreateNote> = ref(
  props.note ?? {
    title: "",
    description: "",
    group_id: null,
  },
);

onMounted(async () => {
  if (Group.store.groups.length == 0) {
    Group.my();
  }
});

const editNote = async () => {
  if (note.value.id) {
    //@ts-ignore
    await Note.update(note.value.id, note.value);
    emits("update-dialog", false);
  }
};

const createNote = async () => {
  //@ts-ignore
  await Note.create(note.value);
  emits("update-dialog", false);
};
</script>

<template>
  <v-dialog v-model="dialog" width="100%" fullscreen>
    <v-card width="100%" align-items="center" class="p-0">
      <template v-slot:title class="title-md-center">
        {{ props.note ? "Редактировать" : "Создать" }} заметку
      </template>
      <v-card-text class="bg-surface-dark">
        <div class="flex justify-between gap-[20px]">
          <v-text-field
            v-model="note.title"
            label="Введите название"
            density="compact"
            variant="outlined"
          ></v-text-field>
          <v-autocomplete
            label="Выберите группу"
            :items="Group.store.groups"
            item-text="title"
            item-value="id"
            v-model="note.group_id"
            class="max-w-[400px]"
            density="compact"
            variant="outlined"
          ></v-autocomplete>
        </div>
        <v-md-editor v-model="note.description" height="93%"></v-md-editor>
        <v-card-actions class="mt-4 grid grid-cols-2 gap-3 absolute right-4">
          <v-btn
            variant="outlined"
            color="red"
            @click="emits('update-dialog', false)"
            >Отмена</v-btn
          >
          <v-btn
            variant="outlined"
            color="purple"
            @click="props.note ? editNote() : createNote()"
            >Сохранить</v-btn
          >
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
.description-textarea {
  &:focus {
    outline: none;
  }
}
</style>
