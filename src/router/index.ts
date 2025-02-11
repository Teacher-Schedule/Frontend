import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Groups from "@/pages/Groups.vue";
import CurrentGroup from "@/pages/CurrentGroup.vue";
import CurrentNote from "@/pages/CurrentNote.vue";
import Notes from "@/pages/Notes.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/groups",
  },
  {
    path: "/groups",
    name: "groups",
    component: Groups,
  },
  {
    path: "/groups/:id",
    name: "group",
    component: CurrentGroup,
  },
  {
    path: "/notes",
    name: "notes",
    component: Notes,
  },
  {
    path: "/notes/:id",
    name: "note",
    component: CurrentNote,
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
