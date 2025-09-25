// import axios from 'axios';
// import GrafikService from '@/services/grafik-service'; // Sesuaikan dengan path yang benar ke file GrafikService

// jest.mock('axios');
// const mockedAxios = axios as jest.MockedFunction<typeof axios>;

// const mockUrl = import.meta.env.VITE_API_URL;

// describe('GrafikService', () => {
//   let service: GrafikService;

//   beforeEach(() => {
//     service = new GrafikService();

//     // Mock localStorage and encryptStorage for token retrieval
//     jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
//       if (key === 'token') {
//         return 'mockToken';
//       }
//       return null;
//     });

//     (localStorage.getItem as jest.Mock).mockReturnValue('mockToken');
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should call getPlanning with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getPlanning' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getPlanning({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}peta/detail-planing`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getRealisasiProyeksi with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getRealisasiProyeksi' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getRealisasiProyeksi({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}peta/detail-realisasi-proyeksi`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getRealisasiYoy with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getRealisasiYoy' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getRealisasiYoy({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}peta/detail-realisasi-yoy`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getPlanReal with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getPlanReal' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getPlanReal({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}peta/detail-planning-realisasi`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getPlanningMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getPlanningMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getPlanningMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}peta/detail-planing-mesin`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getRealisasiProyeksiMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getRealisasiProyeksiMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getRealisasiProyeksiMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}peta/detail-realisasi-proyeksi-mesin`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getRealisasiYoyMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getRealisasiYoyMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getRealisasiYoyMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}peta/detail-realisasi-yoy-mesin`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getPlanRealMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getPlanRealMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getPlanRealMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}peta/detail-planning-realisasi-mesin`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getYearSentral with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getYearSentral' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getYearSentral({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}filter/tahun-persentral`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getYearMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getYearMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getYearMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}filter/tahun-permesin`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getRangeYearSentral with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getRangeYearSentral' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getRangeYearSentral({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}filter/range-tahun-persentral`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getRangeYearMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getRangeYearMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getRangeYearMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}filter/range-tahun-permesin`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikWLCALL with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikWLCALL' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikWLCALL({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/wlc-all-sentral`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikWLCALLDetail with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikWLCALLDetail' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikWLCALLDetail({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/wlc-all-sentral/detail`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikWLCKom with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikWLCKom' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikWLCKom({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/wlc-komponen-sentral`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikWLCKomDetail with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikWLCKomDetail' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikWLCKomDetail({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/wlc-komponen-sentral/detail`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikPlan with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikPlan' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikPlan({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/planning-fs-sentral`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikPlanDetail with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikPlanDetail' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikPlanDetail({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/planning-fs-sentral/detail`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikPRP with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikPRP' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikPRP({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/planning-realisasi-proyeksi-sentral`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikPRPDetail with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikPRPDetail' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikPRPDetail({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/planning-realisasi-proyeksi-sentral/detail`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikPRPLastYear with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikPRPLastYear' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikPRPLastYear({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/prp-lastyear-sentral`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikLastYearDetail with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikLastYearDetail' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikLastYearDetail({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/prp-lastyear-sentral/detail`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikWLCALLMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikWLCALLMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikWLCALLMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/wlc-all`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikWLCALLDetailMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikWLCALLDetailMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikWLCALLDetailMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/wlc-all/detail`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikWLCKomMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikWLCKomMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikWLCKomMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/wlc-komponen`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikWLCKomDetailMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikWLCKomDetailMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikWLCKomDetailMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/wlc-komponen/detail`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikPlanMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikPlanMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikPlanMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/planning-fs`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikPlanDetailMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikPlanDetailMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikPlanDetailMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/planning-fs/detail`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikPlanKomMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikPlanKomMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikPlanKomMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/wlc-komponen-fs`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikPlanKomDetailMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikPlanKomDetailMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikPlanKomDetailMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/wlc-komponen-fs/detail`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikPRPMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikPRPMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikPRPMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/planning-realisasi-proyeksi`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikPRPDetailMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikPRPDetailMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikPRPDetailMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/planning-realisasi-proyeksi/detail`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikPRPLastYearMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikPRPLastYearMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikPRPLastYearMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/prp-lastyear`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGrafikPRPLastYearDetailMesin with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGrafikPRPLastYearDetailMesin' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGrafikPRPLastYearDetailMesin({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}dashboard/grafik/prp-lastyear/detail`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       params: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getAnalitikCapex with correct POST parameters', async () => {
//     const mockResponse = { data: 'mocked response for getAnalitikCapex' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getAnalitikCapex({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'POST',
//       url: `${mockUrl}grafik/laman/finansial/eaf`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       data: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getAnalitikOpex with correct POST parameters', async () => {
//     const mockResponse = { data: 'mocked response for getAnalitikOpex' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getAnalitikOpex({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'POST',
//       url: `${mockUrl}laman/analitik/opex`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       data: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGraphicBiaya with correct POST parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGraphicBiaya' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGraphicBiaya({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'POST',
//       url: `${mockUrl}grafik/laman/komponen`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       data: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGraphicRNFA with correct POST parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGraphicRNFA' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGraphicRNFA({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'POST',
//       url: `${mockUrl}dashboard/grafik/finansial-ebitda`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       data: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGraphicAnalitikEAF with correct POST parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGraphicAnalitikEAF' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGraphicAnalitikEAF({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'POST',
//       url: `${mockUrl}grafik/laman/finansial/eaf`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       data: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGraphicAnalitikCF with correct POST parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGraphicAnalitikCF' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGraphicAnalitikCF({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'POST',
//       url: `${mockUrl}grafik/laman/finansial/ncf`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       data: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGraphicAnalitikEFOR with correct POST parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGraphicAnalitikEFOR' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGraphicAnalitikEFOR({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'POST',
//       url: `${mockUrl}grafik/laman/finansial/efor`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       data: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGraphicOpexBD with correct POST parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGraphicOpexBD' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGraphicOpexBD({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'POST',
//       url: `${mockUrl}grafik/laman/finansial/opex-bd`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       data: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGraphicOpexC with correct POST parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGraphicOpexC' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGraphicOpexC({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'POST',
//       url: `${mockUrl}grafik/laman/finansial/opexc-nphr`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       data: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGraphicTeknisNCF with correct POST parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGraphicTeknisNCF' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGraphicTeknisNCF({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'POST',
//       url: `${mockUrl}grafik/laman/teknis/ncf`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       data: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGraphicTeknisEAF with correct POST parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGraphicTeknisEAF' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGraphicTeknisEAF({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'POST',
//       url: `${mockUrl}grafik/laman/teknis/eaf`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       data: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getGraphicTeknisNPHR with correct POST parameters', async () => {
//     const mockResponse = { data: 'mocked response for getGraphicTeknisNPHR' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getGraphicTeknisNPHR({ example: 'param' });

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'POST',
//       url: `${mockUrl}grafik/laman/teknis/nphr`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       data: { example: 'param' },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getComboKategoriPembangkit with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getComboKategoriPembangkit' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getComboKategoriPembangkit();

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}filter/combo-jenis-kit`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getFilterDaya with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getFilterDaya' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getFilterDaya();

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}grafik/filter/daya`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getTahunTerakhirRealisasiAnalitik with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getTahunTerakhirRealisasiAnalitik' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getTahunTerakhirRealisasiAnalitik();

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}filter/combo-tahun-max`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });

//   it('should call getInitialPembangkit with correct GET parameters', async () => {
//     const mockResponse = { data: 'mocked response for getInitialPembangkit' };
//     mockedAxios.mockResolvedValueOnce({ data: mockResponse });

//     const result = await service.getInitialPembangkit();

//     expect(mockedAxios).toHaveBeenCalledWith({
//       method: 'GET',
//       url: `${mockUrl}filter/combo-max-jenis-pembangkit`,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer mockToken',
//       },
//       timeout: 120000,
//     });

//     expect(result).toEqual(mockResponse);
//   });
// });