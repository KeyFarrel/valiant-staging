import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";
import AuthService from "@/services/auth-service";
import router from "@/router";

const nodeMode: any = import.meta.env.MODE;

export interface MenuItem {
  url: string;
  name: string;
  icon?: string;
  sub_menus?: MenuItem[];
}

export const useMenuStore = defineStore("menu", () => {
  const menuList = ref<MenuItem[]>([]);
  const isMenuLoaded = ref(false);

  const accessibleRoutes = computed(() => {
    return menuList.value
      .flatMap((menu) => menu.sub_menus || [])
      .map((submenu) => submenu.url);
  });

  const isMenuAccessible = (menuName: string) => {
    return accessibleRoutes.value.includes(menuName);
  };

  async function initializeMenu() {
    if (isMenuLoaded.value) return;

    try {
      await fetchMenuFromAPI();
    } catch (error) {
      console.error("Failed to initialize menu:", error);
    }
  }

  async function fetchMenuFromAPI() {
    try {
      const authService = new AuthService();

      const response: any = await authService.getMenu();
      if (response && response.data) {
        menuList.value = response.data;
        isMenuLoaded.value = true;
      }
    } catch (error) {
      console.error("Failed to fetch menu from API:", error);
    }
  }

  function setMenu(menu: MenuItem[]) {
    menuList.value = menu;
    isMenuLoaded.value = true;
  }

  function clearMenu() {
    menuList.value = [];
    isMenuLoaded.value = false;
  }

  return {
    menuList,
    isMenuLoaded,

    accessibleRoutes,
    isMenuAccessible,

    initializeMenu,
    fetchMenuFromAPI,
    setMenu,
    clearMenu,
  };
});
