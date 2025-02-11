<script setup lang="ts">
import { Student } from "@/composables/useStudent";
import { ILab } from "@/types/ILab";
import { IStudent } from "@/types/IStudent";
import { ref } from "vue";

const props = defineProps<{
  lab: ILab;
  student: IStudent;
  grade: {
    grade?: string | number;
    description?: string;
  };
}>();
const emits = defineEmits(["getGroup"]);

const createGradeMenu = ref(false);
const newGrade = ref({
  grade: props.grade?.grade ?? "",
  description: props.grade?.description ?? "",
});

const createGrade = async () => {
  if (!props.student) return;

  const grade = props.student.grades.find(
    (grade) => grade.lab_id === props.lab.id,
  );
  if (grade?.id) {
    await Student.updateGrade({
      student_id: props.student.id,
      lab_id: props.lab.id,
      grade_id: grade.id,
      grade: Number(newGrade.value.grade),
      description: newGrade.value.description,
    });
  } else {
    await Student.createGrade({
      student_id: props.student.id,
      lab_id: props.lab.id,
      grade: Number(newGrade.value.grade),
      description: newGrade.value.description,
    });
  }
  emits("getGroup");
  createGradeMenu.value = false;
};
</script>

<template>
  <v-menu
    v-model="createGradeMenu"
    :close-on-content-click="false"
    location="end"
  >
    <template v-slot:activator="{ props }">
      <td v-bind="props">
        {{ grade.grade ?? "" }}
      </td>
    </template>

    <v-card min-width="300" class="p-3">
      <v-list>
        <v-text-field
          v-model="newGrade.grade"
          variant="outlined"
          density="compact"
          label="Оценка"
          hide-details
          class="w-full"
        ></v-text-field>
        <v-textarea
          v-model="newGrade.description"
          variant="outlined"
          density="compact"
          label="Описание"
          hide-details
          class="w-full mt-4"
        ></v-textarea>
      </v-list>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn variant="text" @click="createGradeMenu = false"> Отмена </v-btn>
        <v-btn color="primary" variant="text" @click="createGrade">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<style scoped lang="scss"></style>
