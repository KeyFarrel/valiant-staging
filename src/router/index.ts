import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useRoleMenuStore } from "@/store/storeRoleMenu";
import { useNavbarLabelStore } from '@/store/storeNavbar';
import { useRekapNavigationStore } from '@/store/storeRekapKertasKerja';
import { encryptStorage } from "@/utils/app-encrypt-storage";
import Sidebar from "@/components/layout/Sidebar.vue";
import PetaSebaran from "@/views/Beranda/PetaSebaran.vue";
import LamanUtama from "@/views/Beranda/LamanUtama/LamanUtama.vue";
import LamanData from "@/views/Beranda/LamanData/LamanData.vue";
import LamanAnalitik from "@/views/Beranda/LamanAnalitik/LamanAnalitik.vue";
import GraphicPage from "@/views/Data/GrafikPage.vue";
import RekapKertasKerja from "@/views/Data/RekapKertasKerja/RekapKertasKerja.vue";
import RekapKertasKerjaV1 from "@/views/Data/RekapKertasKerjaV1/RekapKertasKerjaV1.vue";
import FeasibilityStudy from "@/views/Data/RekapKertasKerja/FeasibilityStudy/FeasibilityStudy.vue";
import FeasibilityStudySentral from "@/views/Data/RekapKertasKerja/FeasibilityStudy/FeasibilityStudySentral.vue";
import VerifikasiApprover from "@/views/Verifikasi/Approver/VerifikasiPersetujuan.vue";
import ApproveDetailFS from "@/views/Verifikasi/Approver/TabPage/FS/DetailFS.vue";
import ApproveDetailKk from "@/views/Verifikasi/Approver/TabPage/KK/DetailKK.vue";
import ApproveDetailFSMesin from "@/views/Verifikasi/Approver/TabPage/FS/DetailFSMesin.vue";
import ApproveDetailKkMesin from "@/views/Verifikasi/Approver/TabPage/KK/DetailKKMesin.vue";
//Persetujuan By Sentral
import VerifikasiSentral from "@/views/Verifikasi/Sentral/VerifikasiPersetujuan.vue";
import PersetujuanFS from "@/views/Verifikasi/Sentral/TabPage/FS/DetailFS.vue";
import PersetujuanKk from "@/views/Verifikasi/Sentral/TabPage/KK/DetailKK.vue";
import PersetujuanFSMesin from "@/views/Verifikasi/Sentral/TabPage/FS/DetailFSMesin.vue";
import PersetujuanKkMesin from "@/views/Verifikasi/Sentral/TabPage/KK/DetailKKMesin.vue";
import InputAsumsiKKApprove from "@/views/Verifikasi/Sentral/TabPage/KK/InputAsumsiParameter.vue";
import SentralAdmin from "@/views/Master/SentralAdmin.vue";
import DetailUnit from "@/views/Master/DetailUnit.vue";
import DetailRekap from "@/views/Data/RekapKertasKerja/DetailRekap/DetailRekap.vue";
import DetailRekapSentral from "@/views/Data/RekapKertasKerja/DetailRekap/DetailRekapSentral.vue";
import PerbaruiData from "@/views/Data/RekapKertasKerja/PerbaruiData/PerbaruiData.vue";
import InputAsumsiParameter from "@/views/Data/RekapKertasKerja/InputAsumsiParameter.vue";
import LihatCAPEX from "@/views/Beranda/LamanData/LihatCAPEX.vue";
import LihatOPEX from "@/views/Beranda/LamanData/LihatOPEX.vue";
import Parameter from "@/views/Master/Parameter.vue";
import ProfileUser from "@/views/Manajemen/Pengguna/ProfileUser.vue";
import Pengguna from "@/views/Manajemen/Pengguna/Pengguna.vue";
import Role from "@/views/Manajemen/Pengguna/RolePage.vue";
import EditPermission from "@/views/Manajemen/Pengguna/EditPermission.vue";
import LogActivity from "@/views/Manajemen/LogActivity/LogActivity.vue";
import MesinBelumTerinput from "@/views/Beranda/LamanUtama/MesinBelumTerinput.vue";
import Login from "../views/Login.vue";
import VerifikasiSSO from "@/views/VerifikasiSSO.vue";
import Error404Page from "@/views/404Page.vue";

const nodeMode: any = import.meta.env.MODE;

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      label: 'Peta Sebaran',
    }
  },
  {
    path: "/redirect-sso",
    name: "redirect-sso",
    component: VerifikasiSSO,
    meta: {
      requiresAuth: true,
      label: 'Verifikasi SSO',
    },
  },
  {
    path: "",
    name: "AA",
    component: Sidebar,
    meta: {
      label: 'Peta Sebaran',
    },
    children: [
      {
        path: "/peta",
        name: "dashboard",
        component: PetaSebaran,
        meta: {
          requiresAuth: true,
          label: 'Peta Sebaran',
        },
      },
      {
        path: "/laman",
        name: "laman",
        component: LamanUtama,
        meta: {
          requiresAuth: true,
          label: 'Laman Utama',
        },
      },
      {
        path: "/laman-data",
        name: "laman-data",
        component: LamanData,
        meta: {
          requiresAuth: true,
          label: 'Laman Data',
        },
      },
      {
        path: "/lihat-capex/:id",
        name: "lihat-capex",
        component: LihatCAPEX,
        meta: {
          requiresAuth: true,
          label: 'Lihat CAPEX',
        },
      },
      {
        path: "/lihat-opex/:id",
        name: "lihat-opex",
        component: LihatOPEX,
        meta: {
          requiresAuth: true,
          label: 'Lihat OPEX',
        },
      },
      {
        path: "/laman-analitik",
        name: "laman-analitik",
        component: LamanAnalitik,
        meta: {
          requiresAuth: true,
          label: 'Laman Analitik',
        }
      },
      {
        path: "/grafik/:id",
        name: "grafik",
        props: true,
        component: GraphicPage,
        meta: {
          requiresAuth: true,
          label: 'Grafik',
        },
      },
      {
        path: "/rekap-kertas-kerja",
        name: "rekap-kertas-kerja",
        component: RekapKertasKerja,
        meta: {
          requiresAuth: true,
          label: 'Rekap Kertas Kerja',
        },
      },
      {
        path: "/rekap-kertas-kerja-v1",
        name: "rekap-kertas-kerja-v1",
        component:  RekapKertasKerjaV1,
        meta: {
          requiresAuth: true,
          label: 'Rekap Kertas Kerja V1',
        },
      },
      {
        path: "/detail-rekap/:id",
        name: "detail-rekap",
        component: DetailRekap,
        meta: {
          requiresAuth: true,
          label: 'Detail Rekap',
        },
      },
      {
        path: "/detail-rekap-sentral/:id",
        name: "detail-rekap-sentral",
        component: DetailRekapSentral,
        meta: {
          requiresAuth: true,
          label: 'Detail Rekap',
        },
      },
      {
        path: "/perbarui-data/:id",
        name: "perbarui-data",
        component: PerbaruiData,
        meta: {
          requiresAuth: true,
          label: 'Perbarui Data',
        },
      },
      {
        path: "/input-asumsi-parameter/:id",
        name: "input-asumsi-parameter",
        component: InputAsumsiParameter,
        meta: {
          requiresAuth: true,
          label: 'Input Asumsi Parameter',
        },
      },
      {
        path: "/feasibility-study/:id",
        name: "feasibility-study",
        component: FeasibilityStudy,
        meta: {
          requiresAuth: true,
          label: 'Feasibility Study',
        },
      },
      {
        path: "/feasibility-study-sentral/:id",
        name: "feasibility-study-sentral",
        component: FeasibilityStudySentral,
        meta: {
          requiresAuth: true,
          label: 'Feasibility Study',
        },
      },       
      // Persetujuan By Approver
      {
        path: "/persetujuan-by-approve",
        name: "persetujuan-by-approve",
        component: VerifikasiApprover,
        meta: {
          requiresAuth: true,
          label: 'Persetujuan',
        },
      },
      // {
      //   path: "/approver-fs",
      //   name: "approver-fs",
      //   component: ApproverFS,
      //   meta: {
      //     requiresAuth: true,
      //     label: 'Persetujuan Feasibility Study',
      //   },
      // },
      // {
      //   path: "/approver-kk",
      //   name: "approver-kk",
      //   component: ApproverKK,
      //   meta: {
      //     requiresAuth: true,
      //     label: 'Persetujuan Kertas Kerja',
      //   },
      // },
      {
        path: "/app-fs-sentral",
        name: "app-fs-sentral",
        component: ApproveDetailFS,
        meta: {
          requiresAuth: true,
          label: 'Detail Persetujuan Feasibility Study',
        },
      },
      {
        path: "/app-kk-sentral",
        name: "app-kk-sentral",
        component: ApproveDetailKk,
        meta: {
          requiresAuth: true,
          label: 'Detail Persetujuan Kertas Kerja',
        },
      },
      {
        path: "/app-fs-mesin/:id?",
        name: "app-fs-mesin",
        component: ApproveDetailFSMesin,
        meta: {
          requiresAuth: true,
          label: 'Detail Persetujuan Feasibility Study',
        },
      },
      {
        path: "/app-kk-mesin/:id?",
        name: "app-kk-mesin",
        component: ApproveDetailKkMesin,
        meta: {
          requiresAuth: true,
          label: 'Detail Persetujuan Kertas Kerja',
        },
      },
      // Persetujuan By Sentral
      {
        path: "/persetujuan",
        name: "persetujuan",
        component: VerifikasiSentral,
        meta: {
          requiresAuth: true,
          label: 'Persetujuan',
        },
      },
      {
        path: "/approve-fs",
        name: "approve-fs",
        component: PersetujuanFS,
        meta: {
          requiresAuth: true,
          label: 'Detail Persetujuan Feasibility Study',
        },
      },
      {
        path: "/approve-kk",
        name: "approve-kk",
        component: PersetujuanKk,
        meta: {
          requiresAuth: true,
          label: 'Detail Persetujuan Kertas Kerja',
        },
      },
      {
        path: "/persetujuan-fs/:id?",
        name: "persetujuan-fs",
        component: PersetujuanFSMesin,
        meta: {
          requiresAuth: true,
          label: 'Detail Persetujuan Feasibility Study',
        },
      },
      {
        path: "/persetujuan-kk/:id?",
        name: "persetujuan-kk",
        component: PersetujuanKkMesin,
        meta: {
          requiresAuth: true,
          label: 'Detail Persetujuan Kertas Kerja',
        },
      },
      {
        path: "/input-asumsi-parameter-approveKK/:id",
        name: "input-asumsi-parameter-approveKK",
        component: InputAsumsiKKApprove,
        meta: {
          requiresAuth: true,
          label: 'Input Asumsi Parameter',
        },
      },
      {
        path: "/master-unit-sentral",
        name: "master-unit-sentral",
        component: SentralAdmin,
        props: true,
        meta: {
          requiresAuth: true,
          label: 'Unit Sentral',
        },
      },
      {
        path: "/detail-unit/:id",
        name: "detail-unit",
        component: DetailUnit,
        meta: {
          requiresAuth: true,
          label: 'Detail Mesin',
        },
      },
      {
        path: "/master-parameter",
        name: "master-parameter",
        component: Parameter,
        meta: {
          requiresAuth: true,
          label: 'Parameter',
        },
      },
      {
        path: "/profile-user",
        name: "profile",
        component: ProfileUser,
        meta: {
          requiresAuth: true,
          label: 'Profil',
        },
      },
      {
        path: "/pengguna",
        name: "pengguna",
        component: Pengguna,
        meta: {
          requiresAuth: true,
          label: 'Pengguna',
        },
      },
      {
        path: "/role",
        name: "role",
        component: Role,
        meta: {
          requiresAuth: true,
          label: 'Role',
        },
      },
      {
        path: "/edit-role/:id",
        name: "edit-permission",
        component: EditPermission,
        meta: {
          requiresAuth: true,
          label: 'Edit Permission',
        },
      },
      {
        path: "/log-activity",
        name: "log-activity",
        component: LogActivity,
        meta: {
          requiresAuth: true,
          label: 'Log Aktivitas',
        },
      },
      // {
      //   path: "/query",
      //   name: "query",
      //   component: Query,
      //   meta: {
      //     requiresAuth: true,
      //     label: 'Query',
      //   },
      // },
      {
        path: "/mesin-belum-terinput",
        name: "mesin-belum-terinput",
        component: MesinBelumTerinput,
        meta: {
          requiresAuth: true,
          label: 'Mesin Belum Terinput',
        },
      },
      {
        path: "/:pathMatch(.*)*",
        name: "not-found",
        component: Error404Page,
        meta: {
          requiresAuth: true,
          label: '404 Error',
        }
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    const rekapNavigationStore = useRekapNavigationStore();
    rekapNavigationStore.scrollPosition.top = savedPosition == null ? 0 : savedPosition.top;
    rekapNavigationStore.scrollPosition.left = savedPosition == null ? 0 : savedPosition.left;
  }
});

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean,
    label: string | undefined,
  }
}

router.beforeEach((to, _, next) => {
  const storeNavbar = useNavbarLabelStore();
  const token = nodeMode === 'production' ? encryptStorage.getItem('token') : localStorage.getItem('token');
  storeNavbar.label = to.meta.label;
  if (to.name === "redirect-sso" && !token) next();
  else if (to.name !== "login" && !token) next({ name: "login" });
  else if (to.name === "login" && token) next({ name: "dashboard" });
  else if (to.name === "AA" && token) next({ name: "dashboard" });
  else next();
});

export default router;
