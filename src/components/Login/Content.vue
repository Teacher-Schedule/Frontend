<script setup lang="ts">
import { User } from "@/composables/useUser";
import { Ref, ref } from "vue";
import { ILogin } from "@/types/Auth";
defineProps<{
  dialog: boolean;
}>();
const emits = defineEmits(["update-dialog"]);

const loginData: Ref<ILogin> = ref({
  email: "" as string,
  password: "" as string,
});

const loginUser = async () => {
  const responseStatus = await User.login(loginData.value);

  if (responseStatus) {
    emits("update-dialog", false);
  }
};
</script>

<template>
  <v-card width="100%" align-items="center" class="p-0">
    <template v-slot:title> Войти </template>
    <v-card-text class="bg-surface-dark">
      <form @submit.prevent>
        <v-text-field
          v-model="loginData.email"
          label="Введите почту"
          density="compact"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="loginData.password"
          label="Введите пароль"
          type="password"
          density="compact"
          variant="outlined"
        ></v-text-field>
        <v-btn type="submit" width="100%" @click="loginUser">Войти</v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
