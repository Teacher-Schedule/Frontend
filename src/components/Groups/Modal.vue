<script setup lang="ts">
import { Rule } from "@/composables/useRules";
import { useWindowSize } from "@vueuse/core";
import { Group } from "@/composables/useGroup";
import { Ref, ref, watch } from "vue";
import { VDialog, VBottomSheet } from "vuetify/components";

const props = defineProps<{
  dialog: boolean;
}>();
const emits = defineEmits(["dialog"]);

const dialog: Ref<boolean> = ref(props.dialog);
const { width } = useWindowSize();
const loading = ref(false);
const form = ref(null);
const data = ref({
  title: "",
});

watch(dialog, (value) => {
  emits("dialog", value);
});

const validate = () => {
  if (loading.value) {
    return true;
  }

  return false;
};

const createGroup = async () => {
  // @ts-ignore
  const { valid } = await form.value.validate();

  if (valid) {
    loading.value = true;
    const response = await Group.create(data.value);

    if (response) {
      dialog.value = false;
    }
    loading.value = false;
  }
};

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
        <v-card-title class="sticky-header p-0">
          <div class="d-flex justify-between align-center">
            <div class="text-h5 text-center dark:text-white">
              Создать группу
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
          <v-form fast-fail ref="form" class="mt-4" @submit.prevent>
            <v-text-field
              v-model="data.title"
              :rules="[Rule.required]"
              :disabled="loading"
              rounded="lg"
              label="Название"
              variant="outlined"
              density="comfortable"
            ></v-text-field>

            <v-btn
              class="mt-4"
              size="large"
              type="submit"
              variant="outlined"
              @click="createGroup"
              :disabled="validate()"
              :loading="loading"
              block
              >Создать</v-btn
            >
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </component>
</template>

<style scoped lang="scss"></style>
