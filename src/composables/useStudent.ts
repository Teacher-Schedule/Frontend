import { IStudent } from "@/types/IStudent";
import { useRequest } from "./useRequest";
import { ILab } from "@/types/ILab";
import { IGroup } from "@/types/IGroup";
import { useErrorNotification } from "./useUtils";
import { toast } from "vue3-toastify";

export class Student {
  static async destroy(id: IStudent["id"]) {
    return await useRequest({
      url: `api/students/${id}`,
      method: "delete",
    });
  }

  static async updateGrade(params: {
    student_id: IStudent["id"];
    lab_id: ILab["id"];
    grade_id: number;
    grade: number;
    description: string;
  }) {
    if (params.grade > 0) {
      return await useRequest({
        url: `api/grades/${params.grade_id}`,
        method: "put",
        body: {
          lab_id: params.lab_id,
          student_id: params.student_id,
          grade: params.grade,
          description: params.description,
        },
      });
    } else {
      return await useRequest({
        url: `api/grades/${params.grade_id}`,
        method: "delete",
      });
    }
  }

  static async loadFromFile(params: { file: File; group_id: IGroup["id"] }) {
    const data = new FormData();
    data.append("file", params.file);
    data.append("group_id", String(params.group_id));

    return await useRequest<{ status: boolean }>({
      url: `api/load/students`,
      method: "post",
      body: data,
    })
      .then((response) => {
        if (response.data.status) {
          toast.success("Файл студенты загружены");
        }
      })
      .catch((response) => {
        useErrorNotification(response.response.data);
      });
  }

  static async create(params: { name: string; group_id: IGroup["id"] }) {
    return await useRequest<IStudent>({
      url: `api/students/`,
      method: "post",
      body: {
        name: params.name,
        group_id: params.group_id,
      },
    });
  }

  static async createGrade(params: {
    student_id: IStudent["id"];
    lab_id: ILab["id"];
    grade: number;
    description: string;
  }) {
    return await useRequest({
      url: `api/grades/`,
      method: "post",
      body: {
        lab_id: params.lab_id,
        student_id: params.student_id,
        grade: params.grade,
        description: params.description,
      },
    });
  }
}
