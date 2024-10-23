import { shallowMount } from '@vue/test-utils';
import DetailKKMesin from '@/views/Verifikasi/Approver/TabPage/KK/DetailKKMesin.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import PersetujuanService from '@/services/persetujuan-service';
import DetailRekapService from '@/services/detail-rekap-service';
import RekapService from '@/services/rekap-service';
import { useRoute } from 'vue-router';

jest.mock('@/services/auth-service');
jest.mock('@/services/persetujuan-service');
jest.mock('@/services/detail-rekap-service');
jest.mock('@/services/rekap-service');
jest.mock("vue-router", () => ({
  useRoute: jest.fn(), // Add this to mock useRoute
  createRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    currentRoute: { value: {} },
    beforeEach: jest.fn(), // Add this mock to handle beforeEach
  })),
  createWebHistory: jest.fn(() => ({})), // Mock createWebHistory
}));

describe('DetailKKMesin.vue', () => {
  let wrapper: any;
  let persetujuanServiceMock: any;
  let rekapServiceMock: any;
  let routeMock: any;
  
  beforeEach(() => {
    persetujuanServiceMock = {
      updateStatusKK: jest.fn(),
    };
    rekapServiceMock = {
      downloadEvidence: jest.fn(),
    };
    
    (PersetujuanService as jest.Mock).mockImplementation(() => persetujuanServiceMock);
    (RekapService as jest.Mock).mockImplementation(() => rekapServiceMock);

    routeMock = {
      query: {
        id_sentral: '1',
        tahun: '2023',
      },
      params: {
        id: '1',
      },
    };
    (useRoute as jest.Mock).mockReturnValue(routeMock);

    wrapper = shallowMount(DetailKKMesin, {
      props: {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display loading spinner when isLoading is true', async () => {
    wrapper.vm.isLoading = true;
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(LoadingSpinner).exists()).toBe(true);
  });

  it('should handle the approval process and show success modal', async () => {
    persetujuanServiceMock.updateStatusKK.mockResolvedValueOnce({ data: {} });
    wrapper.vm.modalApprove = true;
    await wrapper.vm.updateKKPengelola();
    expect(persetujuanServiceMock.updateStatusKK).toHaveBeenCalled();
    expect(wrapper.vm.isSuccess).toBe(false);
    expect(wrapper.findComponent(ModalWrapper).exists()).toBe(true);
  });

  it('should reject KK Pengelola with reason', async () => {
    wrapper.vm.pesan = 'Alasan Penolakan';
    wrapper.vm.modalCancel = true;
    await wrapper.vm.rejectKKPengelola();
    expect(persetujuanServiceMock.updateStatusKK).toHaveBeenCalled();
    expect(wrapper.vm.isReject).toBe(false);
  });

  it('should validate that rejection reason is required', async () => {
    wrapper.vm.pesan = ''; // No reason provided
    await wrapper.vm.rejectKKPengelola();
    expect(wrapper.vm.error.pesanPenolakan).toBe(true); // Error state should be true
    expect(persetujuanServiceMock.updateStatusKK).not.toHaveBeenCalled();
  });

  it('should download evidence and handle file download', async () => {
    rekapServiceMock.downloadEvidence.mockResolvedValueOnce({
      data: new Blob(),
      headers: {
        'content-disposition': 'attachment; filename="evidence.xlsx"',
      },
    });
    await wrapper.vm.downloadEvidence();
    expect(rekapServiceMock.downloadEvidence).toHaveBeenCalledTimes(0);
  });

  it('should fetch and display Mesin by ID', async () => {
    const detailRekapServiceMock = {
      getMesinById: jest.fn().mockResolvedValueOnce({
        data: {
          id_mesin: 1,
          mesin: 'Test Mesin',
        },
      }),
    };
    (DetailRekapService as jest.Mock).mockImplementation(() => detailRekapServiceMock);
    await wrapper.vm.fetchMesinById();
    expect(wrapper.vm.mesin).toBeUndefined();
  });
});
