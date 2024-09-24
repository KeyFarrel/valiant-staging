<template>
  <Loading v-if="isLoading" />
  <div class="bg-white p-6 rounded-lg h-full flex flex-col">
    <form>
      <div class="flex flex-col w-full space-y-5">
        <div class="flex flex-row space-x-2">
          <div class="bg-primaryColor w-1.5 rounded-lg "></div>
          <div class="space-y-0.5">
            <h2 class="text-lg font-semibold text-[7B8DAD]">
              Role :
              <span class="text-lg font-semibold text-primaryTextColor">{{ roleData.role }}</span>
            </h2>
            <h5 class="font-semibold text-[7B8DAD]">
              Level :
              <span class="text-primaryTextColor">{{
                levelMappings[roleData.kode_level]
                }}</span>
            </h5>
          </div>
        </div>
        <!-- <div class="flex items-center">
          <SearchBox class="w-60" />
        </div> -->
        <TableComponent>
          <template v-slot:table-header>
            <tr>
              <th scope="col">No</th>
              <th scope="col">Nama Menu / Fitur</th>
              <th scope="col">Create</th>
              <th scope="col">Read</th>
              <th scope="col">Update</th>
              <!-- <th scope="col">Delete</th> -->
            </tr>
          </template>
          <template v-slot:table-body>
            <tr class="border" v-for="(permission, index) in combinedPermissions" :key="permission.id">
              <td scope="row" class="whitespace-nowrap text-center">
                {{ index + 1 }}
              </td>
              <td class="text-center">
                {{ permission.name }}
              </td>
              <td class="text-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="permission.create" @change="updatePermission(permission)"
                    class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#9de5a8] dark:peer-focus:ring-[#21CD3C] dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#21CD3C]">
                  </div>
                </label>
              </td>
              <td class="text-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="permission.read" @change="updatePermission(permission)"
                    class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#9de5a8] dark:peer-focus:ring-[#21CD3C] dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#21CD3C]">
                  </div>
                </label>
              </td>
              <td class="text-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="permission.update" @change="updatePermission(permission)"
                    class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#9de5a8] dark:peer-focus:ring-[#21CD3C] dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#21CD3C]">
                  </div>
                </label>
              </td>
              <!-- <td class="text-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="permission.delete" @change="updatePermission(permission)"
                    class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#9de5a8] dark:peer-focus:ring-[#21CD3C] dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#21CD3C]">
                  </div>
                </label>
              </td> -->
            </tr>
          </template>
        </TableComponent>
        <!-- <table class="w-full text-sm text-left text-gray-500 rounded overflow-hidden">
          <thead class="pt-4 pb-4 border font-bold text-sm text-[#0099AD] sticky top-0">
            
          </thead>
          <tbody class="overflow-y-auto text-gray-900 text-xs">
            
          </tbody>
        </table> -->
        <nav class="bg-white flex items-center justify-between rounded-b-lg" aria-label="Table navigation">
          <div class="flex items-center">
            <span class="text-sm font-normal text-gray-500 inline-block pr-2">Menampilkan</span>
            <select class="float-right border border-gray-300 text-sm font-semibold rounded block">
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
              <a href="#"
                class="block px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700">
                <span class="sr-only">Previous</span>
                <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"></path>
                </svg>
              </a>
            </li>
            <li>
              <a href="#"
                class="block px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700">
                <span class="sr-only">Next</span>
                <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"></path>
                </svg>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="flex justify-end">
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import RoleService from "@/services/role-service";
import TableComponent from "@/components/ui/Table.vue";
import SearchBox from "@/components/ui/SearchBox.vue";
import Loading from "@/components/ui/LoadingSpinner.vue";
const isLoading = ref(false);
const roleService = new RoleService();

interface PermissionItem {
  id: number;
  name: string;
}

interface RolePermission {
  permission_id: number;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

const allPermissions = ref<PermissionItem[]>([]);
const permissionsByRoleId = ref<RolePermission[]>([]);

onMounted(async () => {
  const roleId = Number(route.params.id);
  if (!isNaN(roleId)) {
    try {
      const permissionsResponse: any = await roleService.getPermission();
      if (Array.isArray(permissionsResponse.data)) {
        allPermissions.value = permissionsResponse.data;
      } else {
        console.error("Expected an array for permissions, got:", permissionsResponse);
        allPermissions.value = [];
      }
    } catch (error) {
      console.error("Error loading permissions:", error);
      allPermissions.value = [];
    }

    try {
      const permissionsByRoleIdResponse: any = await roleService.getPermissionByRoleId(roleId);
      if (Array.isArray(permissionsByRoleIdResponse.data)) {
        permissionsByRoleId.value = permissionsByRoleIdResponse.data;
      } else {
        console.error("Expected an array for permissions by role ID, got:", permissionsByRoleIdResponse);
        permissionsByRoleId.value = [];
      }
    } catch (error) {
      console.error("Error loading permissions by role ID:", error);
      permissionsByRoleId.value = [];
    }
  } else {
    console.error("Invalid role ID");
  }
});


const combinedPermissions = computed(() => {
  return allPermissions.value.map(permission => {
    const rolePermission = permissionsByRoleId.value.find(rp => rp.permission_id === permission.id);
    return {
      ...permission,
      read: rolePermission ? rolePermission.read : false,
      create: rolePermission ? rolePermission.create : false,
      update: rolePermission ? rolePermission.update : false,
      delete: rolePermission ? rolePermission.delete : false
    };
  });
});


const permission = ref<PermissionItem[]>([]);

const route = useRoute();
const id: any = route.params.id;
const roleData = ref({
  role: "",
  kode_level: "",
});

const fetchData = async (id: number) => {
  try {
    isLoading.value = true;
    const response: any = await roleService.getRoleById(id);
    const responseData = response.data;
    roleData.value = responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  if (id) {
    fetchData(id);
  }
});


interface LevelItem {
  kode_level: string;
  level: string;
}

interface ResponseType {
  data: Array<any>;
}

const comboLevel = ref<LevelItem[]>([]);
const levelMappings = ref<{ [key: string]: string }>({});

onMounted(async () => {
  try {
    const response = (await roleService.getLevel()) as ResponseType;
    const responseData = response;
    comboLevel.value = response.data;

    comboLevel.value.forEach((item) => {
      levelMappings.value[item.kode_level] = item.level;
    });
  } catch (error) {
    console.error("Error fetching combo submenu:", error);
    throw error;
  }
});

interface Permission {
  id: number;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}

const updatePermission = async (permission: Permission) => {
  const roleId = Number(route.params.id);
  if (!isNaN(roleId)) {
    try {
      isLoading.value = true;
      await roleService.updateRolePermission(roleId, {
        role_id: roleId,
        permission_id: permission.id,
        read: permission.read,
        create: permission.create,
        update: permission.update,
        delete: permission.delete
      });
    } catch (error) {
      console.error("Error updating permission:", error);
    } finally {
      isLoading.value = false;
    }
  } else {
    console.error("Invalid role ID");
  }

};
</script>

<style scoped>
td {
  padding: 0.8rem;
}
</style>
