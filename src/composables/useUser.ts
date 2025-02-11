import { useAuthStore } from "@/stores/auth";
import axios from "@/axios";
import { ILogin } from "@/types/Auth";
import { IRegister } from "@/types/Auth";
import { toast } from "vue3-toastify";
import { IUser } from "@/types/IUser";
import { useRequest } from "./useRequest";
import { useErrorNotification } from "./useUtils";

export class User {
  static get store() {
    return useAuthStore();
  }
  static async login(loginData: ILogin) {
    return await useRequest<IUser>({
      url: "api/auth/login",
      method: "post",
      body: {
        email: loginData.email,
        password: loginData.password,
      },
    })
      .then(async (response) => {
        localStorage.setItem("auth_token", response.data.token);

        await this.get();

        toast.success(`Добро пожаловать ${this.store.user?.name}`);
        return true;
      })
      .catch((response) => {
        useErrorNotification(response.response.data);
        return false;
      });
  }

  static async register(registerData: IRegister) {
    return await useRequest<IUser>({
      url: "api/auth/register",
      method: "post",
      body: {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      },
    })
      .then(async (response) => {
        localStorage.setItem("auth_token", response.data.token);

        await this.get();

        toast.success(`Добро пожаловать ${this.store.user?.name}`);
        return true;
      })
      .catch((response) => {
        useErrorNotification(response.response.data.errors);
        return false;
      });
  }

  static async get() {
    await useRequest<IUser>({
      url: "/api/user",
    }).then((response) => {
      this.store.user = response.data;
    });
  }

  static async logout() {
    await axios
      .get("/api/user/logout", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth_token"),
        },
      })
      .then(() => {
        localStorage.removeItem("auth_token");

        window.location.reload();
      });
  }
}
