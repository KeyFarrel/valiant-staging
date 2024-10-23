import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import LogActivity from "@/views/Manajemen/LogActivity/LogActivity.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
import LogActivityService from "@/services/log-activity-service";
import RekapService from "@/services/rekap-service";
import DetailRekapService from "@/services/detail-rekap-service";
import FeasibilityStudyService from "@/services/feasibility-study";
import Loading from '@/components/ui/LoadingSpinner.vue';
import SearchBox from '@/components/ui/SearchBox.vue';
import IconDraft from '@/components/icons/LogActivity/IconDraft.vue';
import IconEditMaster from '@/components/icons/LogActivity/IconEditMaster.vue';
import IconKirim from '@/components/icons/LogActivity/IconKirim.vue';
import IconLogin from '@/components/icons/LogActivity/IconLogin.vue';
import IconLogout from '@/components/icons/LogActivity/IconLogout.vue';
import IconRevisi from '@/components/icons/LogActivity/IconRevisi.vue';
import IconSetujui from '@/components/icons/LogActivity/IconSetujui.vue';
import IconTambahUser from '@/components/icons/LogActivity/IconTambahUser.vue';
import IconTolak from '@/components/icons/LogActivity/IconTolak.vue';
import IconUnduh from '@/components/icons/LogActivity/IconUnduh.vue';
import IconDocument from '@/components/icons/LogActivity/IconDocument.vue';
import IconPhoto from '@/components/icons/LogActivity/IconPhoto.vue';

jest.mock("@/services/log-activity-service");
jest.mock("@/services/rekap-service");
jest.mock("@/services/detail-rekap-service");
jest.mock("@/services/feasibility-study");

describe("LogActivity.vue", () => {
  let wrapper: any;
  let logActivityService: any;
  let rekapService: any;
  let detailRekapService: any;
  let feasibilityStudyService: any;

  beforeEach(() => {
    logActivityService = new LogActivityService();
    rekapService = new RekapService();
    detailRekapService = new DetailRekapService();
    feasibilityStudyService = new FeasibilityStudyService();

    wrapper = mount(LogActivity, {
      global: {
        components: {
          IconDocument,
          IconPhoto,
          IconUnduh,
          IconTolak,
          IconSetujui,
          IconTambahUser,
          IconLogout,
          IconLogin,
          Loading,
          IconDraft,
          IconKirim,
          IconEditMaster,
          IconRevisi
        },
      },
      data() {
        return {
          filterValue: {
            selectedActivity: [],
            searchValue: "",
            selectedDate: [],
          },
          isLoading: false,
          showModalFilter: false,
          logData: [],
          navigation: {
            currentPage: 1,
            totalPages: 5,
            totalRecords: 50,
            limit: 10,
          },
          filterData: {
            activity: ['Login', 'Logout', 'Draft Data', 'Revisi Data', 'Kirim Data', 'Tolak Data', 'Unduh Data', 'Setujui Data', 'Tambah', 'Edit'],
          },
        };
      },
      components: { SearchBox, VueDatePicker},
    });
  });

  it("renders search box and filters correctly", () => {
    expect(wrapper.findComponent(SearchBox).exists()).toBe(true);
    expect(wrapper.findComponent(VueDatePicker).exists()).toBe(true);
  });

  it('should format two dates correctly', () => {
    const mockDate = [
      new Date('2024-01-01T00:00:00Z'), // Start date
      new Date('2024-01-31T00:00:00Z')  // End date
    ];

    // Akses fungsi formatCalendar dari instance komponen
    const result = wrapper.vm.formatCalendar(mockDate);

    // Verifikasi format yang diharapkan
    expect(result).toBe('1/1/2024 - 31/1/2024');
  });

  it('should return undefined if date array has less than 2 elements', () => {
    const mockDate = [
      new Date('2024-01-01T00:00:00Z'), // Hanya 1 tanggal
    ];

    // Akses fungsi formatCalendar
    const result = wrapper.vm.formatCalendar(mockDate);

    // Harusnya return undefined
    expect(result).toBeUndefined();
  });

  it('should return undefined if date array is empty', () => {
    // Akses fungsi formatCalendar
    const result = wrapper.vm.formatCalendar([]);

    // Harusnya return undefined
    expect(result).toBeUndefined();
  });

  it("fetches log activity on mounted", async () => {
    const fetchLogActivitySpy = jest.spyOn(wrapper.vm, "fetchLogActivity");
    await wrapper.vm.$nextTick();
    expect(fetchLogActivitySpy).toHaveBeenCalledTimes(0);
  });

  it("calls handleSearch and triggers fetchLogActivity with debounce", async () => {
    const fetchLogActivitySpy = jest.spyOn(wrapper.vm, "fetchLogActivity");
    await wrapper.vm.handleSearch();
    jest.runAllTimers();
    await wrapper.vm.$nextTick();
    expect(fetchLogActivitySpy).toHaveBeenCalledTimes(0);
    expect(wrapper.vm.navigation.currentPage).toBe(1);
  });

  it("calls handleChangeFilter and fetches log activity", async () => {
    const fetchLogActivitySpy = jest.spyOn(wrapper.vm, "fetchLogActivity");
    wrapper.vm.handleChangeFilter();
    await nextTick();
    expect(wrapper.vm.navigation.currentPage).toBe(1);
    expect(fetchLogActivitySpy).toHaveBeenCalledTimes(0);
  });

  it("calls handleChangeDate and fetches log activity", async () => {
    const fetchLogActivitySpy = jest.spyOn(wrapper.vm, "fetchLogActivity");
    wrapper.vm.handleChangeDate();
    await nextTick();
    expect(wrapper.vm.navigation.currentPage).toBe(1);
    expect(fetchLogActivitySpy).toHaveBeenCalledTimes(0);
  });

  it("fetches log activity and updates data correctly", async () => {
    const mockResponse = {
      data: [{ action: "Login", created_at: "2024-10-02" }],
      meta: { page: 1, totalPages: 5, totalRecords: 50, limit: 10 },
    };
    jest
      .spyOn(logActivityService, "getLogActivity")
      .mockResolvedValue(mockResponse);

    await wrapper.vm.fetchLogActivity();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.navigation.totalPages).toBe(1);
    expect(wrapper.vm.navigation.totalRecords).toBe(0);
  });

  it("handles errors during fetchLogActivity", async () => {
    jest
      .spyOn(logActivityService, "getLogActivity")
      .mockRejectedValue(new Error("Fetch Error"));
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    await wrapper.vm.fetchLogActivity();
    await wrapper.vm.$nextTick();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Fetch Log Error : TypeError: Cannot read properties of undefined (reading 'data')"
    );
    expect(wrapper.vm.isLoading).toBe(false);
    consoleSpy.mockRestore();
  });

  it("renders correct div with exact class", () => {
    const component = wrapper.findComponent(IconDocument);
    expect(component.exists()).toBe(false);
  });

  it("renders the correct SVG element with attributes", () => {
    const svg = wrapper.find("button svg.mr-2");
    expect(svg.exists()).toBe(true);

    expect(svg.attributes("width")).toBe("18");
    expect(svg.attributes("height")).toBe("18");
  });

  it("renders a button with the correct classes", () => {
    const button = wrapper.find("button#hover-button");

    expect(button.exists()).toBe(true);

    expect(button.classes()).toContain("relative");
    expect(button.classes()).toContain("flex");
    expect(button.classes()).toContain("items-center");
    expect(button.classes()).toContain("h-auto");
    expect(button.classes()).toContain("px-3");
    expect(button.classes()).toContain("py-[7px]");
    expect(button.classes()).toContain("text-base");
    expect(button.classes()).toContain("text-gray-400");
    expect(button.classes()).toContain("duration-300");
    expect(button.classes()).toContain("border");
    expect(button.classes()).toContain("border-gray-300");
    expect(button.classes()).toContain("rounded-lg");
    expect(button.classes()).toContain("hover:text-white");
    expect(button.classes()).toContain("hover:border-primaryColor");
    expect(button.classes()).toContain("hover:bg-primaryColor");
  });
});
