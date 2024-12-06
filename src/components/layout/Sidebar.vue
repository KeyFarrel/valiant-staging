<template>
  <nav
    class="fixed top-0 h-[55px] z-50 w-full items-center px-3 py-2 lg:px-5 lg:pl-3 justify-between bg-gradient-to-r flex from-[#00A2B9] to-[#035B71]">
    <div class="flex items-center justify-start">
      <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar"
        type="button"
        class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0099AD] ">
        <span class="sr-only">Open sidebar</span>
        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path clip-rule="evenodd" fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
          </path>
        </svg>
      </button>
      <div class="flex items-center ml-2 md:mr-24">
        <ValiantLogo />
        <span v-show="isSidebarOpen"
          class="self-center text-lg font-semibold text-white duration-300 sm:text-2xl whitespace-nowrap">Valiant</span>
      </div>
      <div class="text-white -ml-[72px]" :class="isSidebarOpen ? 'ml-3' : ''">
        <p class="text-lg font-semibold">{{ store.label }}</p>
        <!-- <p class="text-xs font-semibold">
              {{ store.label }}
            </p> Dikomen dulu untuk nanti CR breadcrumbs -->
      </div>
    </div>
    <div class="flex flex-row items-center space-x-3">
      <!-- <button @click="isNotificationShow = !isNotificationShow">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M12 4C9.23859 4 7.00001 6.23858 7.00001 9L6.99982 9.75C6.99982 9.74991 6.99982 9.75009 6.99982 9.75C6.99976 11.79 6.38801 13.689 5.33877 15.2709C6.60342 15.6529 7.9142 15.929 9.26093 16.0887C10.1587 16.1952 11.0726 16.25 11.9998 16.25C12.9271 16.25 13.8412 16.1952 14.7391 16.0887C16.0857 15.9289 17.3963 15.6529 18.6609 15.2709C17.6116 13.6889 16.9998 11.7901 16.9998 9.75V9.04115L17 9C17 6.23858 14.7614 4 12 4ZM5.00002 8.99974C5.00016 5.13386 8.13411 2 12 2C15.866 2 19 5.13401 19 9L18.9998 9.04919V9.75C18.9998 11.809 19.7763 13.6842 21.0541 15.1025C21.2761 15.349 21.3615 15.6894 21.282 16.0114C21.2026 16.3335 20.9686 16.5951 20.6575 16.71C19.1663 17.2605 17.6084 17.6728 15.9994 17.9316C15.9998 17.9544 16 17.9772 16 18C16 20.2091 14.2092 22 12 22C9.79088 22 8.00001 20.2091 8.00001 18C8.00001 17.9772 8.00021 17.9544 8.00059 17.9317C6.39149 17.6729 4.83345 17.2605 3.34218 16.71C3.03102 16.5951 2.79707 16.3335 2.71761 16.0114C2.63815 15.6894 2.72353 15.349 2.94553 15.1025C4.2233 13.6842 4.99982 11.809 4.99982 9.75L5.00002 8.99974C5.00002 8.99982 5.00002 8.99965 5.00002 8.99974ZM10.0073 18.1717C10.0944 19.1959 10.9533 20 12 20C13.0468 20 13.9057 19.1959 13.9927 18.1717C13.3351 18.2236 12.6704 18.25 11.9998 18.25C11.3293 18.25 10.6648 18.2236 10.0073 18.1717Z"
            fill="white" />
        </svg>
      </button>
      <div
        class="bg-white rounded-lg absolute z-[35] p-3 flex flex-col space-y-3 w-[400px] shadow-md right-[170px] top-7"
        v-show="isNotificationShow">
        <div class="flex flex-row items-center justify-between">
          <p class="text-base font-semibold text-primaryTextColor">Notifikasi</p>
          <button class="text-xs text-primaryColor">Tandai semua telah dibaca</button>
        </div>
        <div class="space-y-5">
          <CardNotification v-for="(notificationItem, notificationIndex) in 2" />
        </div>
      </div> -->
      <div class="flex items-center justify-center w-6 h-6 rounded-full bg-warningColor">
        <span class="text-sm font-semibold text-white uppercase">{{ namaPegawai?.split('')[0] }}</span>
      </div>
      <p class="text-white">
        {{ namaPegawai }}
      </p>
      <div class="flex items-center mr-4">
        <button type="button" class="flex text-sm bg-gray-800 rounded-full active:ring active:ring-[#0099AD]"
          aria-expanded="false" data-dropdown-toggle="dropdown-user" data-dropdown-offset-distance="-30"
          data-dropdown-offset-skidding="90" data-dropdown-placement="left">
          <span class="sr-only">Open user menu</span>
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="16" height="16" rx="8" fill="#E5E7E9" />
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M8.13743 9.84159C7.92622 10.0528 7.58378 10.0528 7.37257 9.84159L4.66841 7.13743C4.4572 6.92622 4.4572 6.58378 4.66841 6.37257C4.87962 6.16136 5.22205 6.16136 5.43326 6.37257L7.755 8.69431L10.0767 6.37257C10.2879 6.16136 10.6304 6.16136 10.8416 6.37257C11.0528 6.58378 11.0528 6.92622 10.8416 7.13743L8.13743 9.84159Z"
              fill="#0099AD" />
          </svg>
        </button>
        <div
          class="max-w-64 border whitespace-nowrap z-[45] hidden text-base list-none bg-white divide-y divide-gray-100 rounded-md shadow"
          id="dropdown-user">
          <div class="flex flex-row items-center p-5">
            <div class="mr-3">
              <div class="flex flex-row items-center justify-center rounded-full w-14 h-14 bg-warningColor">
                <span class="text-xl font-semibold text-white uppercase">{{ namaPegawai?.split('')[0] }}</span>
              </div>
            </div>
            <div class="flex flex-col justify-center space-y-0.5">
              <p class="text-sm font-semibold truncate text-primaryTextColor max-w-36">{{ namaPegawai }}</p>
              <RouterLink to="/profile-user" class="text-[#2671D9] underline text-xs">Lihat Profil</RouterLink>
            </div>
          </div>
          <hr />
          <button @click="authService.logOut"
            class="flex items-center w-full justify-center py-2 space-x-1.5 cursor-pointer border">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 8V6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4H19C19.5304 4 20.0391 4.21071 20.4142 4.58579C20.7893 4.96086 21 5.46957 21 6V18C21 18.5304 20.7893 19.0391 20.4142 19.4142C20.0391 19.7893 19.5304 20 19 20H12C11.4696 20 10.9609 19.7893 10.5858 19.4142C10.2107 19.0391 10 18.5304 10 18V16"
                stroke="#333333" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M15 12H3M3 12L6 9M3 12L6 15" stroke="#333333" stroke-width="1.33333" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            <p class="text-sm text-primaryTextColor">Logout</p>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <aside id="logo-sidebar"
    class="fixed top-0 left-0 z-40 h-screen pt-[55px] border-r border-[#E5E7E9] sm:translate-x-0 duration-300"
    :class="isSidebarOpen ? 'w-[240px]' : 'w-20'" @mouseleave="toggleSidebar" aria-label="Sidebar">
    <div v-show="isSidebarOpen" class="h-full pb-4 overflow-y-auto bg-white whitespace-nowrap">
      <ul class="space-y-2 font-medium">
        <li class="px-3">
          <div class="flex items-center mt-6 px-2 text-[#7F7F80] rounded-lg">
            <svg class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" width="20" height="20"
              viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M11.0884 2.75243C11.0396 2.70362 10.9604 2.70362 10.9116 2.75243L4.5 9.16404V18.8748C4.5 18.9439 4.55596 18.9998 4.625 18.9998H7.75V15.1248C7.75 13.9512 8.70139 12.9998 9.875 12.9998H12.125C13.2986 12.9998 14.25 13.9512 14.25 15.1248V18.9998H17.375C17.444 18.9998 17.5 18.9439 17.5 18.8748V9.16405L11.0884 2.75243ZM19.5 11.164L20.0429 11.7069C20.4334 12.0975 21.0666 12.0975 21.4571 11.7069C21.8476 11.3164 21.8476 10.6832 21.4571 10.2927L12.5026 1.33822C11.6727 0.508354 10.3273 0.508355 9.4974 1.33822L0.542893 10.2927C0.152369 10.6832 0.152369 11.3164 0.542893 11.7069C0.933417 12.0975 1.56658 12.0975 1.95711 11.7069L2.5 11.164V18.8748C2.5 20.0484 3.45139 20.9998 4.625 20.9998H17.375C18.5486 20.9998 19.5 20.0484 19.5 18.8748V11.164ZM12.25 18.9998H9.75V15.1248C9.75 15.0558 9.80596 14.9998 9.875 14.9998H12.125C12.194 14.9998 12.25 15.0558 12.25 15.1248V18.9998Z"
                fill="#7F7F80" />
            </svg>
            <span class="mt-1 ml-3 text-sm font-semibold">Beranda</span>
          </div>
        </li>
        <li>
          <RouterLink to="/peta" id="sidebar-button" @click="store.label = 'Peta Sebaran'"
            class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Peta Sebaran' }">
            <span class="ml-8 text-xs">Peta Sebaran</span>
          </RouterLink>
        </li>
        <li class="px-3"
          v-if="(authService.checkLevel() === 'Admin' || authService.checkLevel() === 'Pusat' || authService.checkLevel() === 'Pengelola' || authService.checkLevel() === 'Pembina') && (authService.checkRole() === 'Monitoring' || authService.checkRole() === 'Super Admin')">
          <div class="flex items-center px-2 pt-1 text-[#7F7F80]">
            <span class="ml-8 text-xs font-semibold">Laman</span>
          </div>
        </li>
        <li
          v-if="(authService.checkLevel() === 'Admin' || authService.checkLevel() === 'Pusat') && (authService.checkRole() === 'Monitoring' || authService.checkRole() === 'Super Admin')">
          <RouterLink to="/laman" id="sidebar-button" @click="store.label = 'Laman Utama'"
            class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Laman Utama' }">
            <svg width="11" height="11" class="ml-8" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 1V5C1 5.53043 1.21071 6.03914 1.58579 6.41421C1.96086 6.78929 2.46957 7 3 7H9.66667M9.66667 7L7 4.33333M9.66667 7L7 9.66667"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                class="stroke-[#7F7F8050] duration-500" />
            </svg>
            <span class="ml-3 text-xs">Laman Utama</span>
          </RouterLink>
        </li>
        <li
          v-if="(authService.checkLevel() === 'Admin' || authService.checkLevel() === 'Pusat' || authService.checkLevel() === 'Pengelola' || authService.checkLevel() === 'Pembina') && (authService.checkRole() === 'Monitoring' || authService.checkRole() === 'Super Admin')">
          <RouterLink id="sidebar-button" @click="store.label = 'Laman Data'" to="/laman-data"
            class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Laman Data' }">
            <svg width="11" height="11" class="ml-8" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 1V5C1 5.53043 1.21071 6.03914 1.58579 6.41421C1.96086 6.78929 2.46957 7 3 7H9.66667M9.66667 7L7 4.33333M9.66667 7L7 9.66667"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                class="stroke-[#7F7F8050] duration-500" />
            </svg>
            <span class="ml-3 text-xs">Laman Data</span>
          </RouterLink>
        </li>
        <li
          v-if="(authService.checkLevel() === 'Admin' || authService.checkLevel() === 'Pusat' || authService.checkLevel() === 'Pengelola' || authService.checkLevel() === 'Pembina') && (authService.checkRole() === 'Monitoring' || authService.checkRole() === 'Super Admin')">
          <RouterLink id="sidebar-button" @click="store.label = 'Laman Analitik'" to="/laman-analitik"
            class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Laman Analitik' }">
            <svg width="11" height="11" class="ml-8" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 1V5C1 5.53043 1.21071 6.03914 1.58579 6.41421C1.96086 6.78929 2.46957 7 3 7H9.66667M9.66667 7L7 4.33333M9.66667 7L7 9.66667"
                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                class="stroke-[#7F7F8050] duration-500" />
            </svg>
            <span class="ml-3 text-xs">Laman Analitik</span>
          </RouterLink>
        </li>
        <li class="px-3">
          <div class="flex items-center px-2 text-[#7F7F80]">
            <svg class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" width="22" height="22"
              viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M5.625 3.25C5.55596 3.25 5.5 3.30596 5.5 3.375V20.625C5.5 20.694 5.55596 20.75 5.625 20.75H18.375C18.444 20.75 18.5 20.694 18.5 20.625V11.625C18.5 10.3133 17.4367 9.25 16.125 9.25H14.625C13.4514 9.25 12.5 8.29861 12.5 7.125V5.625C12.5 4.31332 11.4367 3.25 10.125 3.25H5.625ZM5.625 1.25C4.4514 1.25 3.5 2.20139 3.5 3.375V20.625C3.5 21.7986 4.45139 22.75 5.625 22.75H18.375C19.5486 22.75 20.5 21.7986 20.5 20.625V11.25C20.5 5.72715 16.0228 1.25 10.5 1.25H5.625ZM14.2577 4.18566C14.4147 4.63642 14.5 5.12075 14.5 5.625V7.125C14.5 7.19404 14.556 7.25 14.625 7.25H16.125C16.6293 7.25 17.1136 7.33531 17.5643 7.49229C16.816 6.08846 15.6615 4.93396 14.2577 4.18566Z"
                fill="#7F7F80" />
            </svg>
            <span class="mt-1 ml-3 text-sm font-semibold">Data</span>
          </div>
        </li>
        <li>
          <RouterLink id="sidebar-button" @click="store.label = 'Grafik'" to="/peta"
            class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Grafik' }">
            <span class="ml-8 text-xs">Grafik</span>
          </RouterLink>
        </li>
        <li v-if="authService.checkRole() !== 'Approver'">
          <RouterLink id="sidebar-button"
            @click="store.label = 'Rekap Kertas Kerja'; rekapStore.searchRekapQuery = ''; rekapStore.selectedRekapSearchQuery = '';"
            to="/rekap-kertas-kerja" href="#" class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Rekap Kertas Kerja' }">
            <span class="ml-8 text-xs">Rekap Kertas Kerja</span>
          </RouterLink>
        </li>
        <!-- <li v-if="authService.checkLevel() === 'Admin'">
          <RouterLink id="sidebar-button"
            @click="store.label = 'Rekap Kertas Kerja V1'; rekapStore.searchRekapQuery = ''; rekapStore.selectedRekapSearchQuery = '';"
            to="/rekap-kertas-kerja-v1" href="#" class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Rekap Kertas Kerja V1' }">
            <span class="ml-8 text-xs">Rekap Kertas Kerja V1</span>
          </RouterLink>
        </li> -->
        <li class="px-3"
          v-if="authService.checkRole() == 'Approver' || authService.checkRole() == 'Staff' || authService.checkRole() == 'Super Admin' || authService.checkRole() == 'Monitoring' || authService.checkRole() == 'Input'">
          <div class="flex items-center px-2 text-[#7F7F80]">
            <svg class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" width="22" height="22"
              viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.5 20H5.5C5.23478 20 4.98043 19.8946 4.79289 19.7071C4.60536 19.5196 4.5 19.2652 4.5 19V5C4.5 4.73478 4.60536 4.48043 4.79289 4.29289C4.98043 4.10536 5.23478 4 5.5 4H10.5V7C10.5 7.79565 10.8161 8.55871 11.3787 9.12132C11.9413 9.68393 12.7044 10 13.5 10H16.5V15C16.5 15.2652 16.6054 15.5196 16.7929 15.7071C16.9804 15.8946 17.2348 16 17.5 16C17.7652 16 18.0196 15.8946 18.2071 15.7071C18.3946 15.5196 18.5 15.2652 18.5 15V8.94C18.4896 8.84813 18.4695 8.75763 18.44 8.67V8.58C18.3919 8.47718 18.3278 8.38267 18.25 8.3L12.25 2.3C12.1673 2.22222 12.0728 2.15808 11.97 2.11C11.9369 2.10421 11.9031 2.10421 11.87 2.11C11.7728 2.058 11.6683 2.02092 11.56 2H5.5C4.70435 2 3.94129 2.31607 3.37868 2.87868C2.81607 3.44129 2.5 4.20435 2.5 5V19C2.5 19.7956 2.81607 20.5587 3.37868 21.1213C3.94129 21.6839 4.70435 22 5.5 22H11.5C11.7652 22 12.0196 21.8946 12.2071 21.7071C12.3946 21.5196 12.5 21.2652 12.5 21C12.5 20.7348 12.3946 20.4804 12.2071 20.2929C12.0196 20.1054 11.7652 20 11.5 20ZM12.5 5.41L15.09 8H13.5C13.2348 8 12.9804 7.89464 12.7929 7.70711C12.6054 7.51957 12.5 7.26522 12.5 7V5.41ZM7.5 14H13.5C13.7652 14 14.0196 13.8946 14.2071 13.7071C14.3946 13.5196 14.5 13.2652 14.5 13C14.5 12.7348 14.3946 12.4804 14.2071 12.2929C14.0196 12.1054 13.7652 12 13.5 12H7.5C7.23478 12 6.98043 12.1054 6.79289 12.2929C6.60536 12.4804 6.5 12.7348 6.5 13C6.5 13.2652 6.60536 13.5196 6.79289 13.7071C6.98043 13.8946 7.23478 14 7.5 14ZM11.5 16H7.5C7.23478 16 6.98043 16.1054 6.79289 16.2929C6.60536 16.4804 6.5 16.7348 6.5 17C6.5 17.2652 6.60536 17.5196 6.79289 17.7071C6.98043 17.8946 7.23478 18 7.5 18H11.5C11.7652 18 12.0196 17.8946 12.2071 17.7071C12.3946 17.5196 12.5 17.2652 12.5 17C12.5 16.7348 12.3946 16.4804 12.2071 16.2929C12.0196 16.1054 11.7652 16 11.5 16ZM7.5 10H8.5C8.76522 10 9.01957 9.89464 9.20711 9.70711C9.39464 9.51957 9.5 9.26522 9.5 9C9.5 8.73478 9.39464 8.48043 9.20711 8.29289C9.01957 8.10536 8.76522 8 8.5 8H7.5C7.23478 8 6.98043 8.10536 6.79289 8.29289C6.60536 8.48043 6.5 8.73478 6.5 9C6.5 9.26522 6.60536 9.51957 6.79289 9.70711C6.98043 9.89464 7.23478 10 7.5 10ZM21.21 16.29C21.117 16.1963 21.0064 16.1219 20.8846 16.0711C20.7627 16.0203 20.632 15.9942 20.5 15.9942C20.368 15.9942 20.2373 16.0203 20.1154 16.0711C19.9936 16.1219 19.883 16.1963 19.79 16.29L16.5 19.59L15.21 18.29C15.1168 18.1968 15.0061 18.1228 14.8842 18.0723C14.7624 18.0219 14.6319 17.9959 14.5 17.9959C14.3681 17.9959 14.2376 18.0219 14.1158 18.0723C13.9939 18.1228 13.8832 18.1968 13.79 18.29C13.6968 18.3832 13.6228 18.4939 13.5723 18.6158C13.5219 18.7376 13.4959 18.8681 13.4959 19C13.4959 19.1319 13.5219 19.2624 13.5723 19.3842C13.6228 19.5061 13.6968 19.6168 13.79 19.71L15.79 21.71C15.883 21.8037 15.9936 21.8781 16.1154 21.9289C16.2373 21.9797 16.368 22.0058 16.5 22.0058C16.632 22.0058 16.7627 21.9797 16.8846 21.9289C17.0064 21.8781 17.117 21.8037 17.21 21.71L21.21 17.71C21.3037 17.617 21.3781 17.5064 21.4289 17.3846C21.4797 17.2627 21.5058 17.132 21.5058 17C21.5058 16.868 21.4797 16.7373 21.4289 16.6154C21.3781 16.4936 21.3037 16.383 21.21 16.29Z"
                fill="#7F7F80" />
            </svg>
            <span class="mt-1 ml-3 text-sm font-semibold">Verifikasi</span>
          </div>
        </li>
        <li
          v-if="authService.checkRole() == 'Approver' || authService.checkRole() == 'Staff' || authService.checkRole() == 'Super Admin' || authService.checkRole() == 'Monitoring' || authService.checkRole() == 'Input'">
          <RouterLink id="sidebar-button" @click="store.label = 'Persetujuan'" to="/persetujuan-by-approve"
            class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Persetujuan' }">
            <span class="flex ml-8 text-xs">
              <p class="mr-2 mt-0.5">Persetujuan</p>
              <div class="bg-[#FF6363] text-white px-1 py-0.5 rounded-sm">{{ totalPersetujuanKK + totalPersetujuanFS }}
              </div>
            </span>
          </RouterLink>
        </li>
        <li v-else-if="authService.checkLevel() == 'Sentral'">
          <RouterLink id="sidebar-button" @click="store.label = 'Persetujuan'" to="/persetujuan"
            class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Persetujuan' }">
            <span class="flex ml-8 text-xs">
              <p class="mr-2 mt-0.5">Persetujuan</p>
              <div class="bg-[#FF6363] text-white px-1 py-0.5 rounded-sm">{{ totalPersetujuanKK + totalPersetujuanFS }}
              </div>
            </span>
          </RouterLink>
        </li>
        <li class="px-3">
          <div class="flex items-center px-2 text-gray-900">
            <svg class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900" width="22" height="22"
              viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 17C7.80222 17 7.60888 17.0586 7.44443 17.1685C7.27998 17.2784 7.15181 17.4346 7.07612 17.6173C7.00043 17.8 6.98063 18.0011 7.01921 18.1951C7.0578 18.3891 7.15304 18.5673 7.29289 18.7071C7.43275 18.847 7.61093 18.9422 7.80491 18.9808C7.99889 19.0194 8.19996 18.9996 8.38268 18.9239C8.56541 18.8482 8.72159 18.72 8.83147 18.5556C8.94135 18.3911 9 18.1978 9 18C9 17.7348 8.89464 17.4804 8.70711 17.2929C8.51957 17.1054 8.26522 17 8 17ZM8 11C7.80222 11 7.60888 11.0586 7.44443 11.1685C7.27998 11.2784 7.15181 11.4346 7.07612 11.6173C7.00043 11.8 6.98063 12.0011 7.01921 12.1951C7.0578 12.3891 7.15304 12.5673 7.29289 12.7071C7.43275 12.847 7.61093 12.9422 7.80491 12.9808C7.99889 13.0194 8.19996 12.9996 8.38268 12.9239C8.56541 12.8482 8.72159 12.72 8.83147 12.5556C8.94135 12.3911 9 12.1978 9 12C9 11.7348 8.89464 11.4804 8.70711 11.2929C8.51957 11.1054 8.26522 11 8 11ZM16 2H8C6.93913 2 5.92172 2.42143 5.17157 3.17157C4.42143 3.92172 4 4.93913 4 6V18C4 19.0609 4.42143 20.0783 5.17157 20.8284C5.92172 21.5786 6.93913 22 8 22H16C17.0609 22 18.0783 21.5786 18.8284 20.8284C19.5786 20.0783 20 19.0609 20 18V6C20 4.93913 19.5786 3.92172 18.8284 3.17157C18.0783 2.42143 17.0609 2 16 2ZM18 18C18 18.5304 17.7893 19.0391 17.4142 19.4142C17.0391 19.7893 16.5304 20 16 20H8C7.46957 20 6.96086 19.7893 6.58579 19.4142C6.21071 19.0391 6 18.5304 6 18V15.44C6.60399 15.8036 7.29504 15.997 8 16H16C16.705 15.997 17.396 15.8036 18 15.44V18ZM18 12C18 12.5304 17.7893 13.0391 17.4142 13.4142C17.0391 13.7893 16.5304 14 16 14H8C7.46957 14 6.96086 13.7893 6.58579 13.4142C6.21071 13.0391 6 12.5304 6 12V9.44C6.60399 9.80355 7.29504 9.99705 8 10H16C16.705 9.99705 17.396 9.80355 18 9.44V12ZM16 8H8C7.46957 8 6.96086 7.78929 6.58579 7.41421C6.21071 7.03914 6 6.53043 6 6C6 5.46957 6.21071 4.96086 6.58579 4.58579C6.96086 4.21071 7.46957 4 8 4H16C16.5304 4 17.0391 4.21071 17.4142 4.58579C17.7893 4.96086 18 5.46957 18 6C18 6.53043 17.7893 7.03914 17.4142 7.41421C17.0391 7.78929 16.5304 8 16 8Z"
                fill="#7F7F80" />
            </svg>
            <span class="ml-3 font-semibold mt-1 text-sm text-[#7F7F80]">Master</span>
          </div>
        </li>
        <li>
          <RouterLink id="sidebar-button" @click="store.label = 'Unit Sentral'" to="/master-unit-sentral"
            class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Unit Sentral' }">
            <span class="ml-8 text-xs">Unit Sentral</span>
          </RouterLink>
        </li>
        <li v-if="authService.checkLevel() === 'Admin'">
          <RouterLink id="sidebar-button" @click="store.label = 'Parameter'" to="/master-parameter"
            class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Parameter' }">
            <span class="ml-8 text-xs">Parameter</span>
          </RouterLink>
        </li>
        <li class="px-3" v-if="authService.checkLevel() === 'Admin'">
          <div class="flex items-center px-2 text-[#7F7F80]">
            <svg class="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 " width="21" height="21"
              viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M8.625 4C7.31332 4 6.25 5.06332 6.25 6.375C6.25 7.68668 7.31332 8.75 8.625 8.75C9.93668 8.75 11 7.68668 11 6.375C11 5.06332 9.93668 4 8.625 4ZM4.25 6.375C4.25 3.95875 6.20875 2 8.625 2C11.0412 2 13 3.95875 13 6.375C13 8.79125 11.0412 10.75 8.625 10.75C6.20875 10.75 4.25 8.79125 4.25 6.375ZM17.625 7C16.7275 7 16 7.72754 16 8.625C16 9.52246 16.7275 10.25 17.625 10.25C18.5225 10.25 19.25 9.52246 19.25 8.625C19.25 7.72754 18.5225 7 17.625 7ZM14 8.625C14 6.62297 15.623 5 17.625 5C19.627 5 21.25 6.62297 21.25 8.625C21.25 10.627 19.627 12.25 17.625 12.25C15.623 12.25 14 10.627 14 8.625ZM3.26956 18.6632C4.86476 19.5162 6.68714 20 8.625 20C10.5629 20 12.3853 19.5162 13.9805 18.6632C13.9154 17.8964 13.6897 17.1771 13.3375 16.5374C12.4217 14.8737 10.6539 13.75 8.625 13.75C5.81204 13.75 3.50377 15.9109 3.26956 18.6632ZM15.2745 20.2324C13.315 21.3571 11.0437 22 8.625 22C6.10673 22 3.74818 21.3031 1.73511 20.091C1.43978 19.9132 1.25686 19.5958 1.25106 19.2511C1.25036 19.2092 1.25 19.1672 1.25 19.125C1.25 15.0519 4.5519 11.75 8.625 11.75C10.9247 11.75 12.9776 12.8029 14.3293 14.4502C15.2197 13.7019 16.3695 13.25 17.625 13.25C20.4554 13.25 22.75 15.5445 22.75 18.375C22.75 18.4466 22.7485 18.518 22.7456 18.589C22.7304 18.9555 22.5159 19.2843 22.1866 19.4457C20.8087 20.1212 19.2596 20.5 17.625 20.5C16.8175 20.5 16.0305 20.4076 15.2745 20.2324ZM15.958 18.3343C16.4961 18.4429 17.0534 18.5 17.625 18.5C18.7181 18.5 19.7605 18.2911 20.7158 17.9115C20.4919 16.4054 19.1933 15.25 17.625 15.25C16.7508 15.25 15.9601 15.6084 15.392 16.1887C15.683 16.8585 15.8775 17.5798 15.958 18.3343Z"
                fill="#7F7F80" />
            </svg>
            <span class="mt-1 ml-3 text-sm font-semibold">Manajemen</span>
          </div>
        </li>
        <li v-if="authService.checkLevel() === 'Admin'">
          <RouterLink id="sidebar-button" @click="store.label = 'Pengguna'" to="/pengguna"
            class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Pengguna' }">
            <span class="ml-8 text-xs">Pengguna</span>
          </RouterLink>
        </li>
        <!-- <li v-if="authService.checkLevel() === 'Admin'">
          <RouterLink id="sidebar-button" @click="store.label = 'Role'" to="/role"
            class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Role' }">
            <span class="ml-8 text-xs">Role</span>
          </RouterLink>
        </li> -->
        <li v-if="authService.checkLevel() === 'Admin'">
          <RouterLink id="sidebar-button" @click="store.label = 'Log Aktivitas'" to="/log-activity"
            class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Log Aktivitas' }">
            <span class="ml-8 text-xs">Log Aktivitas</span>
          </RouterLink>
        </li>
        <!-- <li class="px-3">
          <div class="flex items-center px-2 text-gray-900">
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M3 2C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73478 2 3V17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H7.5C8.05228 18 8.5 18.4477 8.5 19C8.5 19.5523 8.05228 20 7.5 20H3C2.20435 20 1.44129 19.6839 0.87868 19.1213C0.31607 18.5587 0 17.7957 0 17V3C0 2.20435 0.31607 1.44129 0.87868 0.87868C1.44129 0.31607 2.20435 0 3 0H10C10.2652 0 10.5196 0.105357 10.7071 0.292893L15.7071 5.29289C15.8946 5.48043 16 5.73478 16 6V11C16 11.5523 15.5523 12 15 12C14.4477 12 14 11.5523 14 11V7H11C10.4696 7 9.96086 6.78929 9.58579 6.41421C9.21071 6.03914 9 5.53043 9 5V2H3ZM11 3.41421L12.5858 5H11V3.41421ZM13.2929 14.7071C12.9024 14.3166 12.9024 13.6834 13.2929 13.2929C13.6834 12.9024 14.3166 12.9024 14.7071 13.2929L17.7071 16.2929C18.0976 16.6834 18.0976 17.3166 17.7071 17.7071L14.7071 20.7071C14.3166 21.0976 13.6834 21.0976 13.2929 20.7071C12.9024 20.3166 12.9024 19.6834 13.2929 19.2929L14.5858 18H10C9.44771 18 9 17.5523 9 17C9 16.4477 9.44771 16 10 16H14.5858L13.2929 14.7071Z"
                fill="#7F7F80" />
            </svg>
            <span class="ml-3 font-semibold mt-1 text-sm text-[#7F7F80]">Query</span>
          </div>
        </li>
        <li>
          <RouterLink id="sidebar-button" @click="store.label = 'Query'" to="/query"
            class="flex items-center px-5 py-2 text-[#7F7F80] duration-500"
            :class="{ selected: store.label === 'Query' }">
            <span class="ml-8 text-xs">Query</span>
          </RouterLink>
        </li> -->
      </ul>
    </div>
    <div v-show="!isSidebarOpen" class="h-full p-4 overflow-y-auto bg-white" @mouseenter="toggleSidebar">
      <ul class="space-y-5 font-medium">
        <li class="flex items-center justify-center h-12 rounded-lg"
          :class="{ selected: store.label === 'Peta Sebaran' || store.label === 'Laman Utama' || store.label === 'Laman Data' || store.label === 'Laman Analitik' }">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="cursor-pointer">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M12.0884 3.75146C12.0396 3.70264 11.9604 3.70264 11.9116 3.75146L5.5 10.1631V19.8739C5.5 19.9429 5.55596 19.9989 5.625 19.9989H8.75V16.1239C8.75 14.9502 9.70139 13.9989 10.875 13.9989H13.125C14.2986 13.9989 15.25 14.9502 15.25 16.1239V19.9989H18.375C18.444 19.9989 18.5 19.9429 18.5 19.8739V10.1631L12.0884 3.75146ZM20.5 12.1631L21.0429 12.706C21.4334 13.0965 22.0666 13.0965 22.4571 12.706C22.8476 12.3154 22.8476 11.6823 22.4571 11.2917L13.5026 2.33724C12.6727 1.50738 11.3273 1.50738 10.4974 2.33724L1.54289 11.2917C1.15237 11.6823 1.15237 12.3154 1.54289 12.706C1.93342 13.0965 2.56658 13.0965 2.95711 12.706L3.5 12.1631V19.8739C3.5 21.0475 4.45139 21.9989 5.625 21.9989H18.375C19.5486 21.9989 20.5 21.0475 20.5 19.8739V12.1631ZM13.25 19.9989H10.75V16.1239C10.75 16.0548 10.806 15.9989 10.875 15.9989H13.125C13.194 15.9989 13.25 16.0548 13.25 16.1239V19.9989Z"
              fill="#7F7F80" />
          </svg>
        </li>
        <li class="flex items-center justify-center h-12 rounded-lg"
          :class="{ selected: store.label === 'Grafik' || store.label === 'Rekap Kertas Kerja' || store.label === 'Rekap Kertas Kerja V1' }">
          <svg width="24" height="24" class="cursor-pointer" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M5.625 3.25C5.55596 3.25 5.5 3.30596 5.5 3.375V20.625C5.5 20.694 5.55596 20.75 5.625 20.75H18.375C18.444 20.75 18.5 20.694 18.5 20.625V11.625C18.5 10.3133 17.4367 9.25 16.125 9.25H14.625C13.4514 9.25 12.5 8.29861 12.5 7.125V5.625C12.5 4.31332 11.4367 3.25 10.125 3.25H5.625ZM5.625 1.25C4.4514 1.25 3.5 2.20139 3.5 3.375V20.625C3.5 21.7986 4.45139 22.75 5.625 22.75H18.375C19.5486 22.75 20.5 21.7986 20.5 20.625V11.25C20.5 5.72715 16.0228 1.25 10.5 1.25H5.625ZM14.2577 4.18566C14.4147 4.63642 14.5 5.12075 14.5 5.625V7.125C14.5 7.19404 14.556 7.25 14.625 7.25H16.125C16.6293 7.25 17.1136 7.33531 17.5643 7.49229C16.816 6.08846 15.6615 4.93396 14.2577 4.18566Z"
              fill="#7F7F80" />
          </svg>
        </li>
        <li class="flex items-center justify-center h-12 rounded-lg"
          :class="{ selected: store.label === 'Persetujuan' }">
          <div class="relative">
            <div v-if="totalPersetujuanKK + totalPersetujuanFS > 0"
              class="absolute z-10 border-2 border-[#FFE5E6] w-2.5 h-2.5 rounded-full bottom-4 right-4 bg-warningColor">
            </div>
            <svg width="24" height="24" class="cursor-pointer" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M11.5 20H5.5C5.23478 20 4.98043 19.8946 4.79289 19.7071C4.60536 19.5196 4.5 19.2652 4.5 19V5C4.5 4.73478 4.60536 4.48043 4.79289 4.29289C4.98043 4.10536 5.23478 4 5.5 4H10.5V7C10.5 7.79565 10.8161 8.55871 11.3787 9.12132C11.9413 9.68393 12.7044 10 13.5 10H16.5V15C16.5 15.2652 16.6054 15.5196 16.7929 15.7071C16.9804 15.8946 17.2348 16 17.5 16C17.7652 16 18.0196 15.8946 18.2071 15.7071C18.3946 15.5196 18.5 15.2652 18.5 15V8.94C18.4896 8.84813 18.4695 8.75763 18.44 8.67V8.58C18.3919 8.47718 18.3278 8.38267 18.25 8.3L12.25 2.3C12.1673 2.22222 12.0728 2.15808 11.97 2.11C11.9369 2.10421 11.9031 2.10421 11.87 2.11C11.7728 2.058 11.6683 2.02092 11.56 2H5.5C4.70435 2 3.94129 2.31607 3.37868 2.87868C2.81607 3.44129 2.5 4.20435 2.5 5V19C2.5 19.7956 2.81607 20.5587 3.37868 21.1213C3.94129 21.6839 4.70435 22 5.5 22H11.5C11.7652 22 12.0196 21.8946 12.2071 21.7071C12.3946 21.5196 12.5 21.2652 12.5 21C12.5 20.7348 12.3946 20.4804 12.2071 20.2929C12.0196 20.1054 11.7652 20 11.5 20ZM12.5 5.41L15.09 8H13.5C13.2348 8 12.9804 7.89464 12.7929 7.70711C12.6054 7.51957 12.5 7.26522 12.5 7V5.41ZM7.5 14H13.5C13.7652 14 14.0196 13.8946 14.2071 13.7071C14.3946 13.5196 14.5 13.2652 14.5 13C14.5 12.7348 14.3946 12.4804 14.2071 12.2929C14.0196 12.1054 13.7652 12 13.5 12H7.5C7.23478 12 6.98043 12.1054 6.79289 12.2929C6.60536 12.4804 6.5 12.7348 6.5 13C6.5 13.2652 6.60536 13.5196 6.79289 13.7071C6.98043 13.8946 7.23478 14 7.5 14ZM11.5 16H7.5C7.23478 16 6.98043 16.1054 6.79289 16.2929C6.60536 16.4804 6.5 16.7348 6.5 17C6.5 17.2652 6.60536 17.5196 6.79289 17.7071C6.98043 17.8946 7.23478 18 7.5 18H11.5C11.7652 18 12.0196 17.8946 12.2071 17.7071C12.3946 17.5196 12.5 17.2652 12.5 17C12.5 16.7348 12.3946 16.4804 12.2071 16.2929C12.0196 16.1054 11.7652 16 11.5 16ZM7.5 10H8.5C8.76522 10 9.01957 9.89464 9.20711 9.70711C9.39464 9.51957 9.5 9.26522 9.5 9C9.5 8.73478 9.39464 8.48043 9.20711 8.29289C9.01957 8.10536 8.76522 8 8.5 8H7.5C7.23478 8 6.98043 8.10536 6.79289 8.29289C6.60536 8.48043 6.5 8.73478 6.5 9C6.5 9.26522 6.60536 9.51957 6.79289 9.70711C6.98043 9.89464 7.23478 10 7.5 10ZM21.21 16.29C21.117 16.1963 21.0064 16.1219 20.8846 16.0711C20.7627 16.0203 20.632 15.9942 20.5 15.9942C20.368 15.9942 20.2373 16.0203 20.1154 16.0711C19.9936 16.1219 19.883 16.1963 19.79 16.29L16.5 19.59L15.21 18.29C15.1168 18.1968 15.0061 18.1228 14.8842 18.0723C14.7624 18.0219 14.6319 17.9959 14.5 17.9959C14.3681 17.9959 14.2376 18.0219 14.1158 18.0723C13.9939 18.1228 13.8832 18.1968 13.79 18.29C13.6968 18.3832 13.6228 18.4939 13.5723 18.6158C13.5219 18.7376 13.4959 18.8681 13.4959 19C13.4959 19.1319 13.5219 19.2624 13.5723 19.3842C13.6228 19.5061 13.6968 19.6168 13.79 19.71L15.79 21.71C15.883 21.8037 15.9936 21.8781 16.1154 21.9289C16.2373 21.9797 16.368 22.0058 16.5 22.0058C16.632 22.0058 16.7627 21.9797 16.8846 21.9289C17.0064 21.8781 17.117 21.8037 17.21 21.71L21.21 17.71C21.3037 17.617 21.3781 17.5064 21.4289 17.3846C21.4797 17.2627 21.5058 17.132 21.5058 17C21.5058 16.868 21.4797 16.7373 21.4289 16.6154C21.3781 16.4936 21.3037 16.383 21.21 16.29Z"
                fill="#7F7F80" />
            </svg>
          </div>
        </li>
        <li class="flex items-center justify-center h-12 rounded-lg"
          :class="{ selected: store.label === 'Sentral' || store.label === 'Parameter' }">
          <svg width="24" height="24" class="cursor-pointer" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 17C7.80222 17 7.60888 17.0586 7.44443 17.1685C7.27998 17.2784 7.15181 17.4346 7.07612 17.6173C7.00043 17.8 6.98063 18.0011 7.01921 18.1951C7.0578 18.3891 7.15304 18.5673 7.29289 18.7071C7.43275 18.847 7.61093 18.9422 7.80491 18.9808C7.99889 19.0194 8.19996 18.9996 8.38268 18.9239C8.56541 18.8482 8.72159 18.72 8.83147 18.5556C8.94135 18.3911 9 18.1978 9 18C9 17.7348 8.89464 17.4804 8.70711 17.2929C8.51957 17.1054 8.26522 17 8 17ZM8 11C7.80222 11 7.60888 11.0586 7.44443 11.1685C7.27998 11.2784 7.15181 11.4346 7.07612 11.6173C7.00043 11.8 6.98063 12.0011 7.01921 12.1951C7.0578 12.3891 7.15304 12.5673 7.29289 12.7071C7.43275 12.847 7.61093 12.9422 7.80491 12.9808C7.99889 13.0194 8.19996 12.9996 8.38268 12.9239C8.56541 12.8482 8.72159 12.72 8.83147 12.5556C8.94135 12.3911 9 12.1978 9 12C9 11.7348 8.89464 11.4804 8.70711 11.2929C8.51957 11.1054 8.26522 11 8 11ZM16 2H8C6.93913 2 5.92172 2.42143 5.17157 3.17157C4.42143 3.92172 4 4.93913 4 6V18C4 19.0609 4.42143 20.0783 5.17157 20.8284C5.92172 21.5786 6.93913 22 8 22H16C17.0609 22 18.0783 21.5786 18.8284 20.8284C19.5786 20.0783 20 19.0609 20 18V6C20 4.93913 19.5786 3.92172 18.8284 3.17157C18.0783 2.42143 17.0609 2 16 2ZM18 18C18 18.5304 17.7893 19.0391 17.4142 19.4142C17.0391 19.7893 16.5304 20 16 20H8C7.46957 20 6.96086 19.7893 6.58579 19.4142C6.21071 19.0391 6 18.5304 6 18V15.44C6.60399 15.8036 7.29504 15.997 8 16H16C16.705 15.997 17.396 15.8036 18 15.44V18ZM18 12C18 12.5304 17.7893 13.0391 17.4142 13.4142C17.0391 13.7893 16.5304 14 16 14H8C7.46957 14 6.96086 13.7893 6.58579 13.4142C6.21071 13.0391 6 12.5304 6 12V9.44C6.60399 9.80355 7.29504 9.99705 8 10H16C16.705 9.99705 17.396 9.80355 18 9.44V12ZM16 8H8C7.46957 8 6.96086 7.78929 6.58579 7.41421C6.21071 7.03914 6 6.53043 6 6C6 5.46957 6.21071 4.96086 6.58579 4.58579C6.96086 4.21071 7.46957 4 8 4H16C16.5304 4 17.0391 4.21071 17.4142 4.58579C17.7893 4.96086 18 5.46957 18 6C18 6.53043 17.7893 7.03914 17.4142 7.41421C17.0391 7.78929 16.5304 8 16 8Z"
              fill="#7F7F80" />
          </svg>
        </li>
        <li class="flex items-center justify-center h-12 rounded-lg"
          :class="{ selected: store.label === 'Pengguna' || store.label === 'Role' }"
          v-if="authService.checkLevel() === 'Admin'">
          <svg width="24" height="24" class="cursor-pointer" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M8.625 4C7.31332 4 6.25 5.06332 6.25 6.375C6.25 7.68668 7.31332 8.75 8.625 8.75C9.93668 8.75 11 7.68668 11 6.375C11 5.06332 9.93668 4 8.625 4ZM4.25 6.375C4.25 3.95875 6.20875 2 8.625 2C11.0412 2 13 3.95875 13 6.375C13 8.79125 11.0412 10.75 8.625 10.75C6.20875 10.75 4.25 8.79125 4.25 6.375ZM17.625 7C16.7275 7 16 7.72754 16 8.625C16 9.52246 16.7275 10.25 17.625 10.25C18.5225 10.25 19.25 9.52246 19.25 8.625C19.25 7.72754 18.5225 7 17.625 7ZM14 8.625C14 6.62297 15.623 5 17.625 5C19.627 5 21.25 6.62297 21.25 8.625C21.25 10.627 19.627 12.25 17.625 12.25C15.623 12.25 14 10.627 14 8.625ZM3.26956 18.6632C4.86476 19.5162 6.68714 20 8.625 20C10.5629 20 12.3853 19.5162 13.9805 18.6632C13.9154 17.8964 13.6897 17.1771 13.3375 16.5374C12.4217 14.8737 10.6539 13.75 8.625 13.75C5.81204 13.75 3.50377 15.9109 3.26956 18.6632ZM15.2745 20.2324C13.315 21.3571 11.0437 22 8.625 22C6.10673 22 3.74818 21.3031 1.73511 20.091C1.43978 19.9132 1.25686 19.5958 1.25106 19.2511C1.25036 19.2092 1.25 19.1672 1.25 19.125C1.25 15.0519 4.5519 11.75 8.625 11.75C10.9247 11.75 12.9776 12.8029 14.3293 14.4502C15.2197 13.7019 16.3695 13.25 17.625 13.25C20.4554 13.25 22.75 15.5445 22.75 18.375C22.75 18.4466 22.7485 18.518 22.7456 18.589C22.7304 18.9555 22.5159 19.2843 22.1866 19.4457C20.8087 20.1212 19.2596 20.5 17.625 20.5C16.8175 20.5 16.0305 20.4076 15.2745 20.2324ZM15.958 18.3343C16.4961 18.4429 17.0534 18.5 17.625 18.5C18.7181 18.5 19.7605 18.2911 20.7158 17.9115C20.4919 16.4054 19.1933 15.25 17.625 15.25C16.7508 15.25 15.9601 15.6084 15.392 16.1887C15.683 16.8585 15.8775 17.5798 15.958 18.3343Z"
              fill="#7F7F80" />
          </svg>
        </li>
        <!-- <li class="flex items-center justify-center h-12 rounded-lg" :class="{ selected: store.label === 'Query' }">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="cursor-pointer">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M7 4C6.73478 4 6.48043 4.10536 6.29289 4.29289C6.10536 4.48043 6 4.73478 6 5V19C6 19.2652 6.10536 19.5196 6.29289 19.7071C6.48043 19.8946 6.73478 20 7 20H11.5C12.0523 20 12.5 20.4477 12.5 21C12.5 21.5523 12.0523 22 11.5 22H7C6.20435 22 5.44129 21.6839 4.87868 21.1213C4.31607 20.5587 4 19.7957 4 19V5C4 4.20435 4.31607 3.44129 4.87868 2.87868C5.44129 2.31607 6.20435 2 7 2H14C14.2652 2 14.5196 2.10536 14.7071 2.29289L19.7071 7.29289C19.8946 7.48043 20 7.73478 20 8V13C20 13.5523 19.5523 14 19 14C18.4477 14 18 13.5523 18 13V9H15C14.4696 9 13.9609 8.78929 13.5858 8.41421C13.2107 8.03914 13 7.53043 13 7V4H7ZM15 5.41421L16.5858 7H15V5.41421ZM17.2929 16.7071C16.9024 16.3166 16.9024 15.6834 17.2929 15.2929C17.6834 14.9024 18.3166 14.9024 18.7071 15.2929L21.7071 18.2929C22.0976 18.6834 22.0976 19.3166 21.7071 19.7071L18.7071 22.7071C18.3166 23.0976 17.6834 23.0976 17.2929 22.7071C16.9024 22.3166 16.9024 21.6834 17.2929 21.2929L18.5858 20H14C13.4477 20 13 19.5523 13 19C13 18.4477 13.4477 18 14 18H18.5858L17.2929 16.7071Z"
              fill="#7F7F80" />
          </svg>
        </li> -->
      </ul>
    </div>
  </aside>
  <div class="bg-[#F6F7FD] min-h-screen pt-12 text-primaryTextColor">
    <div class="px-2 py-5 sm:ml-20 ml-18">
      <RouterView></RouterView>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { initFlowbite } from "flowbite";
import { RouterView } from "vue-router";
import { useNavbarLabelStore } from "@/store/storeNavbar";
import { useRekapSearchStore } from "@/store/storeRekapKertasKerja";
import { encryptStorage, encryptedUserInfo } from "@/utils/app-encrypt-storage";
const rekapStore = useRekapSearchStore();
const store = useNavbarLabelStore();
import AuthService from "../../services/auth-service";
const authService = new AuthService();
import PersetujuanService from "../../services/persetujuan-service";
const persetujuanService = new PersetujuanService();
import ValiantLogo from '@/components/icons/ValiantLogo.vue'
import CardNotification from "../ui/CardNotification.vue";

const nodeMode: any = import.meta.env.MODE;
const levelSentral = ref(nodeMode === 'production' ? encryptStorage.getItem('level_sentral') : localStorage.getItem('level_sentral'));
const tahunBerjalan = new Date().getFullYear();
const isSidebarOpen = ref<boolean>(false);
const namaPegawai = ref(nodeMode === 'production' ? encryptStorage.getItem('nama_pegawai') : localStorage.getItem('nama_pegawai'));
const levelID = nodeMode === 'production' ? encryptStorage.getItem('level_id') : localStorage.getItem('level_id');
const roleId = nodeMode === 'production' ? encryptStorage.getItem('role_id') : localStorage.getItem('role_id');
const isNotificationShow = ref<boolean>(false);
const totalPersetujuanKK = ref<number>(0);
const totalPersetujuanFS = ref<number>(0);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
}

console.log(authService.checkLevel())
const fetchPersetujuanKK = async () => {
  try {
    if (levelID == '3') {
      const response: any = await persetujuanService.getPersetujuanKKSentral({ id_sentral: levelSentral.value, tahun: tahunBerjalan });
      totalPersetujuanKK.value = response.data.mesins !== null ? response.data.mesins.filter((val: any) => val.status_approval !== 'Disetujui').length : 0;
    } else {
      const response: any = await persetujuanService.getPersetujuanKertasKerja({
        kode_pengelola: [],
        id_pembina: [],
        status: [],
        page: 1,
        limit: 10,
        tahun: tahunBerjalan.toString(),
        search: ''
      });
      totalPersetujuanKK.value = response.data !== null ? response.data.filter((val: any) => val.status_approval !== 'Disetujui').length : 0;
    }
  } catch (error) {
    console.error('Fetch Persetujuan KK Sentral Error : ' + error);
  }
}
const fetchPersetujuanFS = async () => {
  try {
    if (levelID == '3') {
      const response: any = await persetujuanService.getPersetujuanFSSentral({ id_sentral: levelSentral.value });
      totalPersetujuanFS.value = response.data.mesins !== null ? response.data.mesins.filter((val: any) => val.status_approval !== 'Disetujui').length : 0;
    } else {
      const response: any = await persetujuanService.getPersetujuanFS({
        kode_pengelola: [],
        id_pembina: [],
        status: [],
        page: 1,
        limit: 10,
        search: ''
      });
      totalPersetujuanFS.value = response.data !== null ? response.data.filter((val: any) => val.status_approval !== 'Disetujui').length : 0;
    }
  } catch (error) {
    console.error('Fetch Persetujuan FS Sentral Error : ' + error);
  }
}

onMounted(() => {
  initFlowbite();
  fetchPersetujuanKK();
  fetchPersetujuanFS();
});
</script>

<style scoped>
#sidebar-button:not(.selected) {
  background: linear-gradient(to left, white 50%, #0099AD15 50%) right;
  background-size: 200%;
  transition: 0.5s ease-out;
}

#sidebar-button:hover {
  background-position: left;
  color: #176C88;
}

#sidebar-button:hover svg path {
  stroke: #176C88;
}

#sidebar-button.selected svg path {
  stroke: #176C88;
}

ul li.selected {
  background-color: #E1F0F4;
}

ul li.selected svg path {
  fill: #176C88;
}

ul li #sidebar-button.selected span,
ul li #sidebar-button.selected span p {
  color: #176C88;
  font-weight: 600;
}
</style>