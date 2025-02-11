<script setup lang="ts">
import LabsAddModal from "@/components/Labs/Add/Modal.vue";
import GroupsGradeItem from "@/components/Groups/GradeItem.vue";
import { Group } from "@/composables/useGroup";
import { Student } from "@/composables/useStudent";
import { IGroup } from "@/types/IGroup";
import { IStudent } from "@/types/IStudent";
import { useHead } from "@vueuse/head";
import { Ref, computed } from "vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currentGroup: Ref<IGroup | null> = ref(null);
const search = ref("");
const addLabModal = ref(false);
const createStudentMenu = ref(false);
const newStudent = ref({
  name: "",
});
const fileInput: Ref<HTMLInputElement | null> = ref(null);

onMounted(async () => {
  await getGroup();
  useHead({
    title: `Группа: ${currentGroup.value?.title}`,
  });
});

const getGroup = async () => {
  currentGroup.value = await Group.get(Number(route.params.id));
};

const deleteStudent = async (id: IStudent["id"]) => {
  await Student.destroy(id).then(async () => {
    if (currentGroup.value?.students) {
      currentGroup.value.students = currentGroup.value.students.filter(
        (item) => item.id != id,
      );
    }
  });
};

const filteredStudents = computed(() => {
  if (!currentGroup.value) return [];
  if (!search.value.trim()) return currentGroup.value.students;

  const searchText = search.value.trim().toLowerCase();
  return currentGroup.value.students.filter((student) =>
    student.name.toLowerCase().includes(searchText),
  );
});

const createStudent = async () => {
  if (currentGroup.value?.id) {
    await Student.create({
      name: newStudent.value.name,
      group_id: currentGroup.value.id,
    }).then((response) => {
      currentGroup.value?.students.push(response.data);
      createStudentMenu.value = false;
      newStudent.value.name = "";
    });
  }
};

const getAutoStatus = (
  student: IStudent,
  type: "percentage" | "default" = "default",
) => {
  if (!currentGroup.value) return "";
  const totalLabs = currentGroup.value.labs.length;
  const completedLabs = student.grades.filter((grade) =>
    currentGroup.value!.labs.some(
      (lab) => lab.id === grade.lab_id && grade.grade !== null,
    ),
  ).length;

  if (type == "default") {
    return completedLabs === totalLabs
      ? "+"
      : `${totalLabs - completedLabs}/${totalLabs}`;
  }
  if (type == "percentage") {
    return completedLabs === totalLabs
      ? 100
      : Math.floor((completedLabs / totalLabs) * 100);
  }
};

const handleFileClick = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileChange = async (event: any) => {
  if (event.target.files && currentGroup.value) {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      try {
        await Student.loadFromFile({
          file,
          group_id: currentGroup.value.id,
        }).then(async () => {
          await getGroup();
        });
      } catch (error) {
        console.error("Ошибка при чтении файла:", error);
      }
    }
    event.target.value = "";
  }
};
</script>

<template>
  <div v-if="currentGroup" class="px-3">
    <h1 class="text-2xl text-center mb-4">Группа {{ currentGroup.title }}</h1>
    <v-text-field
      v-model="search"
      label="Поиск по ФИО студента"
      prepend-inner-icon="mdi-magnify"
      class="mb-4"
      variant="outlined"
      hide-details
      single-line
    ></v-text-field>

    <v-table
      hover
      fixed-header
      class="flex flex-col h-full cursor-default max-h-[50vh]"
    >
      <thead>
        <tr>
          <th class="text-left">№</th>
          <th class="text-left min-w-56">Студент</th>
          <th
            class="text-left min-w-28"
            v-for="lab in currentGroup.labs"
            :key="lab.id"
          >
            {{ lab.title }}
          </th>
          <th class="text-left min-w-32">Ср. оценка</th>
          <th class="text-left min-w-20">Автомат</th>
          <th class="text-left min-w-20">%</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(student, index) in filteredStudents"
          v-if="filteredStudents.length > 0"
          :key="student.id"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ student.name }}</td>
          <GroupsGradeItem
            v-for="lab in currentGroup.labs"
            :key="lab.id"
            :lab="lab"
            :student="student"
            :grade="
              student.grades.find((grade) => grade.lab_id === lab.id) ?? {}
            "
            @get-group="async () => await getGroup()"
          />
          <td>{{ student.average_grade }}</td>
          <td>{{ getAutoStatus(student) }}</td>
          <td>{{ getAutoStatus(student, "percentage") }}</td>
          <td>
            <v-btn
              variant="outlined"
              @click="deleteStudent(student.id)"
              color="red"
            >
              Удалить
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
    <div v-if="filteredStudents.length == 0" class="flex justify-center mt-4">
      Ничего не найдено
    </div>

    <div class="mt-4 flex gap-4 flex-wrap">
      <v-btn variant="outlined" @click="addLabModal = true" color="primary">
        Добавить работы
      </v-btn>
      <v-menu
        v-model="createStudentMenu"
        :close-on-content-click="false"
        location="end"
      >
        <template v-slot:activator="{ props }">
          <v-btn variant="outlined" color="primary" v-bind="props">
            Добавить студента
          </v-btn>
        </template>

        <v-card min-width="300" class="p-3">
          <v-list>
            <v-text-field
              v-model="newStudent.name"
              label="ФИО студента"
              variant="outlined"
              density="compact"
              hide-details
              class="w-full"
            ></v-text-field>
          </v-list>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn variant="text" @click="createStudentMenu = false">
              Отмена
            </v-btn>
            <v-btn color="primary" variant="text" @click="createStudent">
              Создать
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <div>
        <v-btn variant="outlined" @click="handleFileClick" color="primary">
          Импорт студентов из json файла
        </v-btn>
        <input
          type="file"
          ref="fileInput"
          accept="application/json"
          @change="handleFileChange"
          style="display: none"
        />
      </div>
    </div>
    <LabsAddModal
      :dialog="addLabModal"
      :group_id="currentGroup.id"
      :lab_ids="currentGroup.lab_ids"
      @dialog="(e) => (addLabModal = e)"
      @get-group="async () => await getGroup()"
    />
  </div>
</template>

<style scoped lang="scss"></style>
