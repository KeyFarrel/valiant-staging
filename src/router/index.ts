import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import CryptoJS from "crypto-js";
import { useNavbarLabelStore } from "@/store/storeNavbar";
import { useRekapNavigationStore } from "@/store/storeRekapKertasKerja";
import { encryptStoragePromise } from "@/utils/app-encrypt-storage";
import { useMenuStore } from "@/store/storeMenu";
import { useUserAuthStore } from "@/store/storeUserAuth";
import Sidebar from "@/components/layout/Sidebar.vue";

import Login from "../views/Login.vue";
import Error404Page from "@/views/404Page.vue";

const PetaSebaran = () => import("@/views/Beranda/PetaSebaran.vue");
const LamanUtama = () => import("@/views/Beranda/LamanUtama/LamanUtama.vue");
const LamanData = () => import("@/views/Beranda/LamanData/LamanData.vue");
const LamanAnalitik = () =>
  import("@/views/Beranda/LamanAnalitik/LamanAnalitik.vue");
const GraphicPage = () => import("@/views/Data/GrafikPage.vue");
const RekapKertasKerja = () =>
  import("@/views/Data/RekapKertasKerja/RekapKertasKerja.vue");
const RekapKertasKerjaV1 = () =>
  import("@/views/Data/RekapKertasKerjaV1/RekapKertasKerjaV1.vue");
const FeasibilityStudy = () =>
  import("@/views/Data/RekapKertasKerja/FeasibilityStudy/FeasibilityStudy.vue");
const FeasibilityStudySentral = () =>
  import(
    "@/views/Data/RekapKertasKerja/FeasibilityStudy/FeasibilityStudySentral.vue"
  );
const VerifikasiApprover = () =>
  import("@/views/Verifikasi/Approver/VerifikasiPersetujuan.vue");
const ApproveDetailFS = () =>
  import("@/views/Verifikasi/Approver/TabPage/FS/DetailFS.vue");
const ApproveDetailKk = () =>
  import("@/views/Verifikasi/Approver/TabPage/KK/DetailKK.vue");
const ApproveDetailFSMesin = () =>
  import("@/views/Verifikasi/Approver/TabPage/FS/DetailFSMesin.vue");
const ApproveDetailKkMesin = () =>
  import("@/views/Verifikasi/Approver/TabPage/KK/DetailKKMesin.vue");

const VerifikasiSentral = () =>
  import("@/views/Verifikasi/Sentral/VerifikasiPersetujuan.vue");
const PersetujuanFS = () =>
  import("@/views/Verifikasi/Sentral/TabPage/FS/DetailFS.vue");
const PersetujuanKk = () =>
  import("@/views/Verifikasi/Sentral/TabPage/KK/DetailKK.vue");
const PersetujuanFSMesin = () =>
  import("@/views/Verifikasi/Sentral/TabPage/FS/DetailFSMesin.vue");
const PersetujuanKkMesin = () =>
  import("@/views/Verifikasi/Sentral/TabPage/KK/DetailKKMesin.vue");
const InputAsumsiKKApprove = () =>
  import("@/views/Verifikasi/Sentral/TabPage/KK/InputAsumsiParameter.vue");
const PerbaruiDataKKApprove = () =>
  import("@/views/Verifikasi/Sentral/TabPage/KK/PerbaruiData.vue");
const SentralAdmin = () => import("@/views/Master/SentralAdmin.vue");
const DetailUnit = () => import("@/views/Master/DetailUnit.vue");
const DetailRekap = () =>
  import("@/views/Data/RekapKertasKerja/DetailRekap/DetailRekap.vue");
const DetailRekapSentral = () =>
  import("@/views/Data/RekapKertasKerja/DetailRekap/DetailRekapSentral.vue");
const PerbaruiData = () =>
  import("@/views/Data/RekapKertasKerja/PerbaruiData/PerbaruiData.vue");
const InputAsumsiParameter = () =>
  import("@/views/Data/RekapKertasKerja/InputAsumsiParameter.vue");
const LihatCAPEX = () => import("@/views/Beranda/LamanData/LihatCAPEX.vue");
const LihatOPEX = () => import("@/views/Beranda/LamanData/LihatOPEX.vue");
const Parameter = () => import("@/views/Master/Parameter.vue");
const ProfileUser = () => import("@/views/Manajemen/Pengguna/ProfileUser.vue");
const Pengguna = () => import("@/views/Manajemen/Pengguna/Pengguna.vue");
const Role = () => import("@/views/Manajemen/Pengguna/RolePage.vue");
const EditPermission = () =>
  import("@/views/Manajemen/Pengguna/EditPermission.vue");
const LogActivity = () =>
  import("@/views/Manajemen/LogActivity/LogActivity.vue");
const MesinBelumTerinput = () =>
  import("@/views/Beranda/LamanUtama/MesinBelumTerinput.vue");
const VerifikasiSSO = () => import("@/views/VerifikasiSSO.vue");
import AuthService from "@/services/auth-service";

const nodeMode: any = import.meta.env.MODE;

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      label: "Peta Sebaran",
    },
  },
  {
    path: "/redirect-sso",
    name: "redirect-sso",
    component: VerifikasiSSO,
    meta: {
      requiresAuth: true,
      label: "Verifikasi SSO",
    },
  },
  {
    path: "",
    name: "AA",
    component: Sidebar,
    meta: {
      label: "Peta Sebaran",
    },
    children: [
      {
        path: "/peta",
        name: "peta",
        component: PetaSebaran,
        meta: {
          requiresAuth: true,
          label: "Peta Sebaran",
        },
      },
      {
        path: "/laman",
        name: "laman",
        component: LamanUtama,
        meta: {
          requiresAuth: true,
          label: "Laman Utama",
        },
      },
      {
        path: "/laman-data",
        name: "laman-data",
        component: LamanData,
        meta: {
          requiresAuth: true,
          label: "Laman Data",
        },
      },
      {
        path: "/lihat-capex/:id",
        name: "lihat-capex",
        component: LihatCAPEX,
        meta: {
          requiresAuth: true,
          label: "Lihat CAPEX",
        },
      },
      {
        path: "/lihat-opex/:id",
        name: "lihat-opex",
        component: LihatOPEX,
        meta: {
          requiresAuth: true,
          label: "Lihat OPEX",
        },
      },
      {
        path: "/laman-analitik",
        name: "laman-analitik",
        component: LamanAnalitik,
        meta: {
          requiresAuth: true,
          label: "Laman Analitik",
        },
      },
      {
        path: "/grafik/:id",
        name: "grafik",
        props: true,
        component: GraphicPage,
        meta: {
          requiresAuth: true,
          label: "Grafik",
        },
      },
      {
        path: "/rekap-kertas-kerja",
        name: "rekap-kertas-kerja",
        component: RekapKertasKerja,
        meta: {
          requiresAuth: true,
          label: "Rekap Kertas Kerja",
        },
      },
      {
        path: "/rekap-kertas-kerja-v1",
        name: "rekap-kertas-kerja-v1",
        component: RekapKertasKerjaV1,
        meta: {
          requiresAuth: true,
          label: "Rekap Kertas Kerja V1",
        },
      },
      {
        path: "/detail-rekap/:id",
        name: "detail-rekap",
        component: DetailRekap,
        meta: {
          requiresAuth: true,
          label: "Detail Rekap",
        },
      },
      {
        path: "/detail-rekap-sentral/:id",
        name: "detail-rekap-sentral",
        component: DetailRekapSentral,
        meta: {
          requiresAuth: true,
          label: "Detail Rekap",
        },
      },
      {
        path: "/perbarui-data/:id",
        name: "perbarui-data",
        component: PerbaruiData,
        meta: {
          requiresAuth: true,
          label: "Perbarui Data",
        },
      },
      {
        path: "/input-asumsi-parameter/:id",
        name: "input-asumsi-parameter",
        component: InputAsumsiParameter,
        meta: {
          requiresAuth: true,
          label: "Input Asumsi Parameter",
        },
      },
      {
        path: "/feasibility-study/:id",
        name: "feasibility-study",
        component: FeasibilityStudy,
        meta: {
          requiresAuth: true,
          label: "Feasibility Study",
        },
      },
      {
        path: "/feasibility-study-sentral/:id",
        name: "feasibility-study-sentral",
        component: FeasibilityStudySentral,
        meta: {
          requiresAuth: true,
          label: "Feasibility Study",
        },
      },

      {
        path: "/persetujuan-by-approve",
        name: "persetujuan-by-approve",
        component: VerifikasiApprover,
        meta: {
          requiresAuth: true,
          label: "Persetujuan",
        },
      },

      {
        path: "/app-fs-sentral",
        name: "app-fs-sentral",
        component: ApproveDetailFS,
        meta: {
          requiresAuth: true,
          label: "Detail Persetujuan Feasibility Study",
        },
      },
      {
        path: "/app-kk-sentral",
        name: "app-kk-sentral",
        component: ApproveDetailKk,
        meta: {
          requiresAuth: true,
          label: "Detail Persetujuan Kertas Kerja",
        },
      },
      {
        path: "/app-fs-mesin/:id?",
        name: "app-fs-mesin",
        component: ApproveDetailFSMesin,
        meta: {
          requiresAuth: true,
          label: "Detail Persetujuan Feasibility Study",
        },
      },
      {
        path: "/app-kk-mesin/:id?",
        name: "app-kk-mesin",
        component: ApproveDetailKkMesin,
        meta: {
          requiresAuth: true,
          label: "Detail Persetujuan Kertas Kerja",
        },
      },

      {
        path: "/persetujuan",
        name: "persetujuan",
        component: VerifikasiSentral,
        meta: {
          requiresAuth: true,
          label: "Persetujuan",
        },
      },
      {
        path: "/approve-fs",
        name: "approve-fs",
        component: PersetujuanFS,
        meta: {
          requiresAuth: true,
          label: "Detail Persetujuan Feasibility Study",
        },
      },
      {
        path: "/approve-kk",
        name: "approve-kk",
        component: PersetujuanKk,
        meta: {
          requiresAuth: true,
          label: "Detail Persetujuan Kertas Kerja",
        },
      },
      {
        path: "/persetujuan-fs/:id?",
        name: "persetujuan-fs",
        component: PersetujuanFSMesin,
        meta: {
          requiresAuth: true,
          label: "Detail Persetujuan Feasibility Study",
        },
      },
      {
        path: "/persetujuan-kk/:id?",
        name: "persetujuan-kk",
        component: PersetujuanKkMesin,
        meta: {
          requiresAuth: true,
          label: "Detail Persetujuan Kertas Kerja",
        },
      },
      {
        path: "/input-asumsi-parameter-approveKK/:id",
        name: "input-asumsi-parameter-approveKK",
        component: InputAsumsiKKApprove,
        meta: {
          requiresAuth: true,
          label: "Input Asumsi Parameter",
        },
      },
      {
        path: "/perbarui-data-approveKK/:id",
        name: "perbarui-data-approveKK",
        component: PerbaruiDataKKApprove,
        meta: {
          requiresAuth: true,
          label: "Perbarui Data",
        },
      },
      {
        path: "/master-unit-sentral",
        name: "master-unit-sentral",
        component: SentralAdmin,
        props: true,
        meta: {
          requiresAuth: true,
          label: "Unit Sentral",
        },
      },
      {
        path: "/detail-unit/:id",
        name: "detail-unit",
        component: DetailUnit,
        meta: {
          requiresAuth: true,
          label: "Detail Mesin",
        },
      },
      {
        path: "/master-parameter",
        name: "master-parameter",
        component: Parameter,
        meta: {
          requiresAuth: true,
          label: "Parameter",
        },
      },
      {
        path: "/profile-user",
        name: "profile-user",
        component: ProfileUser,
        meta: {
          requiresAuth: true,
          label: "Profil",
        },
      },
      {
        path: "/pengguna",
        name: "pengguna",
        component: Pengguna,
        meta: {
          requiresAuth: true,
          label: "Pengguna",
        },
      },
      {
        path: "/role",
        name: "role",
        component: Role,
        meta: {
          requiresAuth: true,
          label: "Role",
        },
      },
      {
        path: "/edit-role/:id",
        name: "edit-permission",
        component: EditPermission,
        meta: {
          requiresAuth: true,
          label: "Edit Permission",
        },
      },
      {
        path: "/log-activity",
        name: "log-activity",
        component: LogActivity,
        meta: {
          requiresAuth: true,
          label: "Log Aktivitas",
        },
      },

      {
        path: "/mesin-belum-terinput",
        name: "mesin-belum-terinput",
        component: MesinBelumTerinput,
        meta: {
          requiresAuth: true,
          label: "Mesin Belum Terinput",
        },
      },
      {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: Error404Page,
        meta: {
          requiresAuth: true,
          label: "404 Error",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    const rekapNavigationStore = useRekapNavigationStore();
    rekapNavigationStore.scrollPosition.top =
      savedPosition == null ? 0 : savedPosition.top;
    rekapNavigationStore.scrollPosition.left =
      savedPosition == null ? 0 : savedPosition.left;
  },
});

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    label: string | undefined;
  }
}

router.beforeEach(async (to, _, next) => {
  const storeNavbar = useNavbarLabelStore();
  const menuStore = useMenuStore();
  const userAuthStore = useUserAuthStore();
  const authService = new AuthService();
  const encryptStorage = await encryptStoragePromise;
  const token =
    nodeMode === "production"
      ? encryptStorage.getItem("token")
      : localStorage.getItem("token");
  storeNavbar.label = to.meta.label;

  if (token && !menuStore.isMenuLoaded) {
    await menuStore.initializeMenu();
  }

  const storage = nodeMode === "production" ? encryptStorage : localStorage;

  if (token) {
    let role: any;
    let level: any;
    let levelSentral: any;
    let namaPegawai: any;
    let storedHash: any;
    await userAuthStore.fetchUserAuth();
    const getStorage = (storage: any) => {
      levelSentral = storage.getItem("level_sentral");
      namaPegawai = storage.getItem("nama_pegawai");
      storedHash = storage.getItem("user_hash");
    };
    getStorage(storage);

    if (
      levelSentral === null ||
      levelSentral === undefined ||
      !namaPegawai ||
      !storedHash
    ) {
      console.warn("⚠️ Data tidak lengkap, logout user...");
      authService.logout();
      return;
    }

    const dataString = `${levelSentral}:${namaPegawai}`;

    const currentHash = CryptoJS.HmacSHA512(
      dataString,
      (window as any).userHashSecretKey(),
    ).toString();

    console.log("Current Hash:", currentHash);
    console.log("Stored Hash:", storedHash);
    if (storedHash != currentHash) {
      console.warn("⚠️ Data telah dimanipulasi! Logout user...");
      console.log(storedHash, currentHash);
      authService.logout();
    }
  }

  if (to.name === "redirect-sso" && !token) {
    next();
  } else if (!token) {
    if (to.name !== "login") {
      return next({ name: "login" });
    }
    return next();
  } else if (token && !menuStore.isMenuAccessible(to.name.toString())) {
    next({ name: "peta" });
  } else {
    next();
  }
});

export default router;
