import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Ref } from "vue";
import AuthService from "@/services/auth-service";
const authService = new AuthService();

const roleAliasMap: Record<string, string> = {
  "138": "Q8l@dZ#1",
  "140": "Vx_91$pN",
  "141": "zT4*Mb!6",
  "142": "Yb^2d#0Q",
  "143": "nT!z03&k",
};

const resolveRoleName = (alias: string): string | null => {
  switch (alias) {
    case "Q8l@dZ#1":
      return "Staff";
    case "Vx_91$pN":
      return "Approver";
    case "zT4*Mb!6":
      return "Super Admin";
    case "Yb^2d#0Q":
      return "Monitoring";
    case "nT!z03&k":
      return "Input";
    default:
      return null;
  }
};

const levelAliasMap: Record<string, string> = {
  "1": "Xf!8qP@7",
  "2": "Gk#92lV&",
  "3": "Mb*0yT%3",
  "4": "Dr^3Zn$!",
  "5": "Zp@5Kw_9",
};

const resolveLevelName = (alias: string): string | null => {
  switch (alias) {
    case "Xf!8qP@7":
      return "Admin";
    case "Gk#92lV&":
      return "Pengelola";
    case "Mb*0yT%3":
      return "Sentral";
    case "Dr^3Zn$!":
      return "Pembina";
    case "Zp@5Kw_9":
      return "Pusat";
    default:
      return null;
  }
};

export const useUserAuthStore = defineStore("userAuth", () => {
  const roleAlias: Ref<string | null> = ref(null);
  const levelAlias: Ref<string | null> = ref(null);

  const isDataFetched = ref(false);

  const roleName = computed(
    () => resolveRoleName(roleAlias.value || "") ?? "Unknown",
  );
  const levelName = computed(
    () => resolveLevelName(levelAlias.value || "") ?? "Unknown",
  );

  function setRole(roleId: string) {
    roleAlias.value = roleAliasMap[roleId] ?? null;
  }

  function setLevel(levelId: string) {
    levelAlias.value = levelAliasMap[levelId] ?? null;
  }

  async function fetchUserAuth() {
    if (isDataFetched.value) return;

    try {
      const response: any = await authService.profile();
      console.log("User Auth Response:", response);
      if (response?.data?.id_role) setRole(response.data.id_role);
      if (response?.data?.id_level) setLevel(response.data.id_level);
      console.log("Role Alias:", roleAlias.value);
      console.log("Level Alias:", levelAlias.value);
    } catch (err) {
      console.error("Gagal memuat role user:", err);
    } finally {
      isDataFetched.value = true;
    }
  }

  return {
    roleAlias,
    roleName,
    levelAlias,
    levelName,
    isDataFetched,
    setRole,
    setLevel,
    fetchUserAuth,
  };
});
