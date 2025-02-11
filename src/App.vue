<script setup lang="ts">
import Header from "@/components/Header/index.vue";
import { User } from "./composables/useUser";
import { onMounted, ref } from "vue";
import { Lab } from "./composables/useLab";

const loading = ref(true);

onMounted(async () => {
  if (localStorage.getItem("auth_token")) {
    await User.get();
    await Lab.getAll();
  }
  loading.value = false;
});
</script>

<template>
  <div v-if="loading" class="h-screen flex justify-center items-center">
    <div class="w-2/4">
      <v-progress-linear height="8" rounded indeterminate></v-progress-linear>
    </div>
  </div>
  <div v-else>
    <Header />
    <div v-if="User.store.user" class="container mx-auto">
      <RouterView></RouterView>
    </div>
    <div v-else class="mt-10 flex justify-center">
      <h1 class="text-2xl">Авторизуйтесь мямямямямямя!</h1>
    </div>
  </div>
</template>

<style scoped></style>
