<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { RouterLink } from "vue-router";
const url = import.meta.env.VITE_API_URL;

interface RoleItem {
  id_role: string;
  role: string;
  status: number;
  permission: PermissionItem[];
}

interface PermissionItem {
  id_sub_menu: number;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

const formData = ref({
  role: "",
  status: 0,
  permission: [
    {
      id_sub_menu: "",
      create: false,
      read: false,
      update: false,
      delete: false,
    },
  ],
});

const handleStatusChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  formData.value.status = target.checked ? 1 : 0;
};

const role = ref<RoleItem[]>([]);

const isActive = ref(false);

const submitForm = async () => {
  try {
    // Mengambil data dari formData
    const dataToPost = {
      role: formData.value.role,
      status: formData.value.status,
      permission: formData.value.permission.map((item) => ({
        id_sub_menu: parseInt(item.id_sub_menu),
        read: item.read,
        create: item.create,
        update: item.update,
        delete: item.delete,
      })),
    };
    // Mengirim permintaan POST ke API
    const response = await axios.post(`${url}/role`, dataToPost);
    console.log("POST response:", response.data);

    // Reset formulir setelah berhasil
    formData.value.role = "";
    formData.value.status = 0;
    formData.value.permission.forEach((item) => {
      item.read = false;
      item.create = false;
      item.update = false;
      item.delete = false;
    });

    const data = await fetchData();
    role.value = data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

const fetchData = async () => {
  try {
    const response = await axios.get(`${url}/role`);
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

interface SubMenuItem {
  id_sub_menu: number;
  sub_menu: string;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

const comboSubmenu = ref<SubMenuItem[]>([]);

onMounted(async () => {
  try {
    const response = await axios.get(`${url}/submenu/combo-submenu`);
    comboSubmenu.value = response.data.data; // Mengisi data comboSubmenu dengan hasil dari API
  } catch (error) {
    console.error("Error fetching combo submenu:", error);
    throw error;
  }
});
</script>
<template>
  <div class="bg-white px-6 rounded-lg h-full flex flex-col p-6">
    <form>
      <div class="flex flex-col w-full h-auto">
        <h2
          class="border-l-8 border-[#0099AD] text-lg font-semibold text-black pl-2"
        >
          Role
        </h2>
        <div class="flex mt-4 items-center">
          <p class="text-gray-600 font-semibold">Role</p>
          <input
            id="role"
            v-model="formData.role"
            type="text"
            placeholder="Masukan Nama Role"
            class="ml-28 w-full rounded-lg border-2 border-[#E0E0E0] text-black placeholder-[#E0E0E0]"
          />
        </div>
        <div class="flex mt-4 items-center">
          <p class="text-gray-600 font-semibold">Status</p>
          <label
            class="ml-28 relative inline-flex items-center mr-5 cursor-pointer"
          >
            <input
              type="checkbox"
              class="sr-only peer"
              @change="handleStatusChange"
            />
            <div
              class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#9de5a8] dark:peer-focus:ring-[#21CD3C] dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#21CD3C]"
            ></div>
            <span class="ml-3 text-xs font-medium text-[#333333]">
              {{ isActive ? "Aktif" : "Tidak Aktif" }}
            </span>
          </label>
        </div>
      </div>
      <div class="border w-full mt-10"></div>
      <div class="flex flex-col w-full h-auto mt-6">
        <h2
          class="border-l-8 border-[#0099AD] text-lg font-semibold text-black pl-2"
        >
          Akses
        </h2>
        <div class="mt-6 flex items-center">
          <input
            type="search"
            autocomplete="off"
            id="search-dropdown"
            class="block p-3 w-60 text-sm text-gray-900 rounded-l-lg border-l-2 border border-gray-300 focus:ring-[#0099AD] focus:border-[#0099AD]"
            placeholder="Cari...."
          />
          <button
            type="submit"
            class="relative float-left p-3 text-sm font-medium text-white bg-[#0099AD] rounded-r-lg border border-[#0099AD] hover:bg-[#007E8F] focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            <svg
              aria-hidden="true"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <span class="sr-only">Search</span>
          </button>
        </div>
        <div class="mt-6 flex">
          <table
            class="w-full text-sm text-left text-gray-500 rounded overflow-hidden"
          >
            <thead
              class="pt-4 pb-4 border font-bold text-sm text-[#0099AD] sticky top-0"
            >
              <tr>
                <th scope="col" class="px-3 py-6 rounded-tl">No</th>
                <th scope="col" class="px-6 py-6">Nama Menu / Fitur</th>
                <th scope="col" class="px-6 py-6">Tambah</th>
                <th scope="col" class="px-6 py-6">Lihat</th>
                <th scope="col" class="px-6 py-6">Edit</th>
                <th scope="col" class="px-6 py-6">Hapus</th>
              </tr>
            </thead>
            <tbody class="overflow-y-auto text-gray-900 text-xs">
              <tr
                v-for="(item, index) in comboSubmenu"
                :key="item.id_sub_menu"
                class="border"
              >
                <th
                  scope="row"
                  class="px-3 py-3 font-medium whitespace-nowrap rounded-bl"
                >
                  {{ index + 1 }}
                </th>
                <td class="px-6 py-3">
                  {{ item.sub_menu }}
                </td>
                <td class="px-6 py-3">
                  <label
                    class="relative inline-flex items-center mr-5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      v-model="item.create"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#9de5a8] dark:peer-focus:ring-[#21CD3C] dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#21CD3C]"
                    ></div>
                  </label>
                </td>
                <td class="px-6 py-3">
                  <label
                    class="relative inline-flex items-center mr-5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      v-model="item.read"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#9de5a8] dark:peer-focus:ring-[#21CD3C] dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#21CD3C]"
                    ></div>
                  </label>
                </td>
                <td class="px-6 py-3">
                  <label
                    class="relative inline-flex items-center mr-5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      v-model="item.update"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#9de5a8] dark:peer-focus:ring-[#21CD3C] dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#21CD3C]"
                    ></div>
                  </label>
                </td>
                <td class="px-6 py-3">
                  <label
                    class="relative inline-flex items-center mr-5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      class="sr-only peer"
                      v-model="item.delete"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#9de5a8] dark:peer-focus:ring-[#21CD3C] dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#21CD3C]"
                    ></div>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="h-5"></div>
        <nav
          class="mb-10 bg-white flex items-center justify-between pl-4 pr-4 pb-4 rounded-b-lg"
          aria-label="Table navigation"
        >
          <div class="flex items-center">
            <span class="text-sm font-normal text-gray-500 inline-block pr-2"
              >Menampilkan</span
            >
            <select
              class="float-right border border-gray-300 text-sm font-semibold rounded block"
            >
              <option selected value="-1">All</option>
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="60">60</option>
              <option value="80">80</option>
              <option value="100">100</option>
            </select>
            <span class="pl-2">dari 5 data</span>
          </div>
          <ul class="inline-flex items-center -space-x-px">
            <li>
              <a
                href="#"
                class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
              >
                <span class="sr-only">Previous</span>
                <svg
                  class="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
              >
                <span class="sr-only">Next</span>
                <svg
                  class="w-5 h-5"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="flex justify-end">
        <div class="flex items-start">
          <!-- <button type="button"
                            class="w-full text-[#0099AD] bg-white border-2 border-[#80C1CD] hover:bg-[#80C1CD] focus:ring-4 focus:outline-none focus:ring-[#0099AD] font-medium rounded-lg text-xs mr-2 px-5 py-2.5 text-center dark:bg-[#007E8F] dark:hover:bg-white dark:focus:ring-bg-[#80C1CD]"
                            @click="closeModal">
                            Batal
                            </button> -->
          <button
            type="submit"
            class="w-full text-white bg-[#0099AD] hover:bg-[#005A66] focus:ring-4 focus:outline-none focus:ring-[#80C1CD] font-medium rounded-lg text-xs px-5 py-3 text-center dark:bg-[#007E8F] dark:hover:bg-[#0099AD] dark:focus:ring-[#005A66]"
            @click="submitForm"
          >
            Simpan
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
