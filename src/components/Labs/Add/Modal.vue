<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
import { Ref, computed, ref, watch } from "vue";
import { VDialog, VBottomSheet } from "vuetify/components";
import { Lab } from "@/composables/useLab";
import { ILab } from "@/types/ILab";
import { Group } from "@/composables/useGroup";

const props = defineProps<{
  dialog: boolean;
  group_id: number;
  lab_ids: ILab["id"][];
}>();
const emits = defineEmits(["dialog", "getGroup"]);

const dialog: Ref<boolean> = ref(props.dialog);
const { width } = useWindowSize();
const loading = ref(false);
const search = ref("");
const data = ref({
  title: "",
  labs: props.lab_ids,
});
const createLab = ref({
  title: "",
});

const syncLabs = async () => {
  await Group.update(props.group_id, {
    lab_ids: data.value.labs,
  }).then(() => {
    emits("getGroup");
    dialog.value = false;
  });
};

watch(dialog, (value) => {
  emits("dialog", value);
});

const filteredLabs = computed(() => {
  if (!search.value.trim()) return Lab.store.labs;

  const searchText = search.value.trim().toLowerCase();
  return Lab.store.labs.filter((lab) =>
    lab.title.toLowerCase().includes(searchText),
  );
});

watch(
  () => props.dialog,
  (value) => {
    dialog.value = value;
  },
);
</script>

<template>
  <component
    :is="width > 650 ? VDialog : VBottomSheet"
    max-width="650"
    v-model="dialog"
    :persistent="loading"
  >
    <template v-if="dialog">
      <v-card
        rounded="xl"
        class="!bg-neutral-900 card-modal"
        :loading="loading"
      >
        <v-card-title class="sticky-header p-0 mb-4">
          <div class="d-flex justify-between align-center">
            <div class="text-h5 text-center dark:text-white">
              Добавить работы
            </div>

            <v-btn
              icon="mdi-close"
              :disabled="loading"
              variant="text"
              class="text-white"
              :ripple="false"
              @click="dialog = false"
            ></v-btn>
          </div>
        </v-card-title>

        <v-card-text class="dark:text-white scrollable-content !p-0">
          <div class="mb-8">
            <v-text-field
              v-model="createLab.title"
              :disabled="loading"
              rounded="lg"
              label="Создать работу"
              variant="outlined"
              density="comfortable"
            ></v-text-field>
            <v-btn
              class="mt-4"
              size="large"
              type="submit"
              variant="outlined"
              @click="
                Lab.create({ title: createLab.title });
                createLab.title = '';
              "
              :loading="loading"
              block
              >Создать работу</v-btn
            >
          </div>
          <v-text-field
            v-model="search"
            :disabled="loading"
            rounded="lg"
            label="Поиск"
            variant="outlined"
            density="comfortable"
          ></v-text-field>
          <v-checkbox
            v-for="lab in filteredLabs"
            v-model="data.labs"
            :label="lab.title"
            :value="lab.id"
          ></v-checkbox>

          <v-btn
            class="mt-4"
            size="large"
            type="submit"
            variant="outlined"
            @click="syncLabs"
            :loading="loading"
            block
            >Продолжить</v-btn
          >
        </v-card-text>
      </v-card>
    </template>
  </component>
</template>

<style scoped lang="scss"></style>
