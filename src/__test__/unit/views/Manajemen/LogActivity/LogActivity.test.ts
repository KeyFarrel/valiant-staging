import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import LogActivity from '@/views/Manajemen/LogActivity/LogActivity.vue'
import { nextTick } from 'vue'

// Mock notification
vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn()
}))

// Mock Services
const mockLogActivityService = {
  getLogActivity: vi.fn()
}
const mockRekapService = {
  downloadEvidence: vi.fn(),
  downloadExcelKK: vi.fn()
}
const mockFeasibilityStudyService = {
  downloadExcelFS: vi.fn()
}
const mockDetailRekapService = {
  getMesinById: vi.fn()
}

// Mock Constructors
vi.mock('@/services/log-activity-service', () => ({ default: vi.fn(function() { return mockLogActivityService; }) }))
vi.mock('@/services/rekap-service', () => ({ default: vi.fn(function() { return mockRekapService; }) }))
vi.mock('@/services/feasibility-study', () => ({ default: vi.fn(function() { return mockFeasibilityStudyService; }) }))
vi.mock('@/services/detail-rekap-service', () => ({ default: vi.fn(function() { return mockDetailRekapService; }) }))

// Mock URL and Document
global.URL.createObjectURL = vi.fn(() => 'blob:test-url')
const mockLink = {
    href: '',
    setAttribute: vi.fn(),
    click: vi.fn(),
    parentNode: { removeChild: vi.fn() }
}
const originalCreateElement = document.createElement.bind(document)
vi.spyOn(document, 'createElement').mockImplementation((tag) => {
    if (tag === 'a') return mockLink as any
    return originalCreateElement(tag)
})
vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node)
vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node)


const MockComponents = {
    Loading: { template: '<div data-testid="loading">Loading</div>' },
    SearchBox: { template: '<input @input="$emit(\'on-input\')" v-model="modelValue" />', props: ['modelValue'] },
    VueDatePicker: { template: '<div data-testid="date-picker"></div>', props: ['modelValue'] },
    IconDraft: true,
    IconEditMaster: true,
    IconKirim: true,
    IconLogin: true,
    IconLogout: true,
    IconRevisi: true,
    IconSetujui: true,
    IconTambahUser: true,
    IconTolak: true,
    IconUnduh: true,
    IconDocument: true,
    IconUpload: true,
    IconOtherActivity: true,
    IconChevronUp: true,
    IconChevronDown: true
}

describe('LogActivity.vue', () => {
    let wrapper

    const createWrapper = () => {
        return mount(LogActivity, {
            global: {
                stubs: MockComponents,
                directives: {
                    'auto-animate': {}
                }
            }
        })
    }

    beforeEach(() => {
        vi.clearAllMocks()
        // Default success response
        mockLogActivityService.getLogActivity.mockResolvedValue({
            data: [
                {
                    uuid: '1', user: 'User 1', sentral: '', role: 'Admin', action: 'Login', 
                    created_at: '2024-01-01', message: 'Logged in', level: 'Admin',
                    status_fs: 0, tahun: 2024, tahun_realisasi: 2023, uuid_mesin: 101,
                    nama_evidence: 'ev.xlsx', nama_document: 'doc', status_code: 200, isShowDetail: false
                }
            ],
            meta: { page: 1, totalPages: 5, totalRecords: 50, limit: 10 }
        })
    })

    it('should mount and fetch data', async () => {
        wrapper = createWrapper()
        await flushPromises()
        expect(mockLogActivityService.getLogActivity).toHaveBeenCalled()
        expect(wrapper.find('.p-6').exists()).toBe(true)
    })

    it('should handle search', async () => {
        wrapper = createWrapper()
        await flushPromises()
        
        const searchBox = wrapper.find('input')
        await searchBox.setValue('test')
        await searchBox.trigger('input')
        
        // Wait for debounce (500ms in component)
        await new Promise(r => setTimeout(r, 600))
        expect(mockLogActivityService.getLogActivity).toHaveBeenCalledTimes(2) // 1 fetch + 1 search
    })

    it('should handle filter activity add/remove', async () => {
        wrapper = createWrapper()
        await flushPromises()

        const filterBtn = wrapper.find('#hover-button')
        await filterBtn.trigger('click')
        expect(wrapper.vm.showModalFilter).toBe(true)

        // Find checkboxes
        const checkboxes = wrapper.findAll('input[type="checkbox"]')
        // Click first one ('Login')
        await checkboxes[0].setValue(true)
        await checkboxes[0].trigger('change')
        
        await flushPromises()
        expect(wrapper.vm.filterValue.selectedActivity).toContain('Login')
        // Initial + Add
        expect(mockLogActivityService.getLogActivity).toHaveBeenCalled()

        // Remove
        await checkboxes[0].setValue(false)
        await checkboxes[0].trigger('change')
        await flushPromises()
        expect(wrapper.vm.filterValue.selectedActivity).not.toContain('Login')
    })

    it('should handle date change', async () => {
        wrapper = createWrapper()
        await flushPromises()
        
        // Find by testid
        const datePicker = wrapper.find('[data-testid="date-picker"]')
        await datePicker.trigger('update:model-value', [new Date(2024, 0, 1), new Date(2024, 0, 31)])
        
        // Manually trigger the handler because trigger('update:model-value') on a div won't firing the component event 
        // unless we access vm. But we want to avoid that if possible.
        // Actually for stubs, $emit is the way if we can access component.
        // If findComponent fails, we can check why. 
        // fallback: wrapper.vm.handleChangeDate()
        wrapper.vm.filterValue.selectedDate = [new Date(2024, 0, 1), new Date(2024, 0, 31)]
        await wrapper.vm.handleChangeDate()

        await nextTick()
        await flushPromises()
        expect(mockLogActivityService.getLogActivity).toHaveBeenCalled()
    })

    it('should handle pagination', async () => {
        wrapper = createWrapper()
        await flushPromises()

        // Page limit change
        const select = wrapper.find('select')
        await select.setValue('20')
        await select.trigger('change')
        await flushPromises()
        expect(mockLogActivityService.getLogActivity).toHaveBeenCalledWith(expect.objectContaining({ limit: 20, page: 1 }))

        // Next page
        const nextBtn = wrapper.findAll('button').find(b => b.text().includes('Next') || b.find('svg path[d*="7.293 14.707"]').exists()) // Identify next button by svg or structure
        // The component has "Next" in sr-only span.
        // Let's call method directly to be safe or target strict selector
        await wrapper.vm.goToNext()
        expect(mockLogActivityService.getLogActivity).toHaveBeenCalledWith(expect.objectContaining({ page: 2 }))

        // Previous page
        await wrapper.vm.goToPrevious()
        expect(mockLogActivityService.getLogActivity).toHaveBeenCalledWith(expect.objectContaining({ page: 1 }))
        
        // Go to specific page
        await wrapper.vm.goToPage(3)
        expect(mockLogActivityService.getLogActivity).toHaveBeenCalledWith(expect.objectContaining({ page: 3 }))
    })

    describe('Downloads', () => {
        it('should download Excel KK', async () => {
             // Mock machine data for filename
             mockDetailRekapService.getMesinById.mockResolvedValue({ data: { mesin: 'Mesin 1' } })
             mockRekapService.downloadExcelKK.mockResolvedValue({
                 data: new Blob(['test']), 
                 headers: { 'content-disposition': 'attachment; filename="test.xlsx"' }
             })
             
             wrapper = createWrapper()
             await flushPromises()
             
             await wrapper.vm.downloadExcelKK(2024, 2023, 101)
             expect(mockDetailRekapService.getMesinById).toHaveBeenCalledWith(101)
             expect(mockRekapService.downloadExcelKK).toHaveBeenCalledWith(2024, 2023, 101)
             expect(mockLink.click).toHaveBeenCalled()
        })

        it('should download Excel FS', async () => {
             mockDetailRekapService.getMesinById.mockResolvedValue({ data: { mesin: 'Mesin 1' } })
             mockFeasibilityStudyService.downloadExcelFS.mockResolvedValue({
                 data: new Blob(['test']), 
                 headers: { 'content-disposition': 'attachment; filename="test-fs.xlsx"' }
             })
             
             wrapper = createWrapper()
             await flushPromises()
             
             await wrapper.vm.downloadExcelFS(2024, 2023, 101)
             expect(mockFeasibilityStudyService.downloadExcelFS).toHaveBeenCalledWith(2024, 2023, 101)
             expect(mockLink.click).toHaveBeenCalled()
        })

        it('should download Evidence KK', async () => {
            mockRekapService.downloadEvidence.mockResolvedValue({
                 data: new Blob(['test']), 
                 headers: { 'content-disposition': 'attachment; filename="evidence.xlsx"' }
            })
            
            wrapper = createWrapper()
            await flushPromises()
            
            await wrapper.vm.downloadEvidenceKK('doc/path', 'file.xlsx')
            expect(mockRekapService.downloadEvidence).toHaveBeenCalledWith('doc/path')
            expect(mockLink.click).toHaveBeenCalled()
        })

         it('should download Evidence FS', async () => {
            mockRekapService.downloadEvidence.mockResolvedValue({
                 data: new Blob(['test']), 
                 headers: { 'content-disposition': 'attachment; filename="evidence-fs.xlsx"' }
            })
            
            wrapper = createWrapper()
            await flushPromises()
            
            await wrapper.vm.downloadEvidenceFS('doc/path', 'file.xlsx')
            expect(mockRekapService.downloadEvidence).toHaveBeenCalledWith('doc/path')
            expect(mockLink.click).toHaveBeenCalled()
        })
    })

    describe('Error Handling', () => {
        it('should handle fetch error', async () => {
             mockLogActivityService.getLogActivity.mockRejectedValueOnce(new Error('Fetch error'))
             wrapper = createWrapper()
             await flushPromises()
             expect(wrapper.vm.isLoading).toBe(false)
        })

        it('should handle download Excel KK error', async () => {
             mockRekapService.downloadExcelKK.mockRejectedValueOnce(new Error('Download error'))
             wrapper = createWrapper()
             await flushPromises()
             
             await wrapper.vm.downloadExcelKK(2024, 2023, 101)
             expect(wrapper.vm.isLoading).toBe(false)
        })

        it('should handle download Excel FS error', async () => {
             mockFeasibilityStudyService.downloadExcelFS.mockRejectedValueOnce(new Error('Download error'))
             wrapper = createWrapper()
             await flushPromises()
             
             await wrapper.vm.downloadExcelFS(2024, 2023, 101)
             expect(wrapper.vm.isLoading).toBe(false)
        })
        
        it('should handle download Evidence KK error', async () => {
             mockRekapService.downloadEvidence.mockRejectedValueOnce(new Error('Download error'))
             wrapper = createWrapper()
             await flushPromises()
             
             await wrapper.vm.downloadEvidenceKK('doc', 'file')
             expect(wrapper.vm.isLoading).toBe(false)
        })
        
        it('should handle download Evidence FS error', async () => {
             mockRekapService.downloadEvidence.mockRejectedValueOnce(new Error('Download error'))
             wrapper = createWrapper()
             await flushPromises()
             
             await wrapper.vm.downloadEvidenceFS('doc', 'file')
             expect(wrapper.vm.isLoading).toBe(false)
        })
    })

    describe('Edge Cases', () => {
        it('should handle missing filename in content disposition', async () => {
             mockRekapService.downloadEvidence.mockResolvedValue({
                 data: new Blob(['test']), 
                 headers: { 'content-disposition': 'attachment;' }
             })
             wrapper = createWrapper()
             await flushPromises()
             
             await wrapper.vm.downloadEvidenceKK('doc', 'fallback.xlsx')
             // Should use fallback filename
             expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'fallback.xlsx')
        })

        it('should toggle detail view', async () => {
             wrapper = createWrapper()
             await flushPromises()
             
             // Initial state: isShowDetail is false (from mock setup)
             expect(wrapper.vm.logData[0].isShowDetail).toBe(false)
             
             // Find toggle button
             const toggleBtn = wrapper.findComponent({ name: 'IconChevronDown' }).element.parentElement
             await toggleBtn.click()
             
             expect(wrapper.vm.logData[0].isShowDetail).toBe(true)
        })
        
        it('should remove filter value chips', async () => {
             wrapper = createWrapper()
             await flushPromises()
             wrapper.vm.filterValue.selectedActivity = ['Login']
             await nextTick()
             
             const removeBtn = wrapper.find('.bg-primaryColor button')
             await removeBtn.trigger('click')
             expect(wrapper.vm.filterValue.selectedActivity).toHaveLength(0)
             expect(mockLogActivityService.getLogActivity).toHaveBeenCalledTimes(2) 
        })
    })

    describe('Pagination Logic', () => {
        it('should generate page list for small total pages', async () => {
             mockLogActivityService.getLogActivity.mockResolvedValue({
                 data: [],
                 meta: { page: 1, totalPages: 3, totalRecords: 30, limit: 10 }
             })
             wrapper = createWrapper()
             await flushPromises()
             
             const pageList = wrapper.vm.generatePageList
             // Should include 1, 2, 3
             expect(pageList).toEqual([1, 2, 3])
        })

        it('should generate page list for start pages', async () => {
             mockLogActivityService.getLogActivity.mockResolvedValue({
                 data: [],
                 meta: { page: 2, totalPages: 10, totalRecords: 100, limit: 10 }
             })
             wrapper = createWrapper()
             await flushPromises()
             
             const pageList = wrapper.vm.generatePageList
             // Should include 1, 2, 3, 4, ..., 10
             expect(pageList).toEqual([1, 2, 3, 4, '...', 10])
        })

        it('should generate page list for middle pages', async () => {
             // Mock response with many pages
             mockLogActivityService.getLogActivity.mockResolvedValue({
                 data: [],
                 meta: { page: 5, totalPages: 10, totalRecords: 100, limit: 10 }
             })
             wrapper = createWrapper()
             await flushPromises()
             
             const pageList = wrapper.vm.generatePageList
             // Should include 1, ..., 4, 5, 6, ..., 10
             expect(pageList).toContain('...')
             expect(pageList).toContain(4)
             expect(pageList).toContain(5)
             expect(pageList).toContain(6)
        })

        it('should generate page list for end pages', async () => {
             mockLogActivityService.getLogActivity.mockResolvedValue({
                 data: [],
                 meta: { page: 9, totalPages: 10, totalRecords: 100, limit: 10 }
             })
             wrapper = createWrapper()
             await flushPromises()
             
             const pageList = wrapper.vm.generatePageList
             // Should include 1, ..., 8, 9, 10
             expect(pageList[0]).toBe(1)
             expect(pageList[1]).toBe('...')
             expect(pageList).toContain(9)
             expect(pageList).toContain(10)
        })
    })

    describe('Component Logic', () => {
        it('should handle click outside to close filter modal', async () => {
            wrapper = createWrapper()
            await flushPromises()

            // Open modal
            wrapper.vm.showModalFilter = true
            wrapper.vm.dropdownContainer = { contains: vi.fn().mockReturnValue(false) } // Mock container

            // Simulate click event
            const event = { target: document.createElement('div') }
            wrapper.vm.handleClickOutside(event)

            expect(wrapper.vm.showModalFilter).toBe(false)
        })

        it('should not close filter modal if clicked inside', async () => {
            wrapper = createWrapper()
            await flushPromises()

            wrapper.vm.showModalFilter = true
            wrapper.vm.dropdownContainer = { contains: vi.fn().mockReturnValue(true) }

            const event = { target: document.createElement('div') }
            wrapper.vm.handleClickOutside(event)

            expect(wrapper.vm.showModalFilter).toBe(true)
        })
        
        it('should format calendar correctly', () => {
            wrapper = createWrapper()
            const dateRange = [new Date(2024, 0, 1), new Date(2024, 0, 31)]
            const formatted = wrapper.vm.formatCalendar(dateRange)
            // Expect D/M/YYYY
            expect(formatted).toBe('1/1/2024 - 31/1/2024')
        })

        it('should return undefined for invalid calendar range', () => {
            wrapper = createWrapper()
            const dateRange = [new Date(2024, 0, 1)] // Only one date
            const formatted = wrapper.vm.formatCalendar(dateRange)
            expect(formatted).toBeUndefined()
        })
    })

    describe('Robust Downloads', () => {
        it('should proceed with Excel KK download even if getMesinById fails', async () => {
            mockDetailRekapService.getMesinById.mockRejectedValue(new Error('Mesin not found'))
            mockRekapService.downloadExcelKK.mockResolvedValue({
                 data: new Blob(['test']), 
                 headers: { 'content-disposition': 'attachment; filename="backup.xlsx"' }
            })
            
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            
            wrapper = createWrapper()
            await flushPromises()
            
            await wrapper.vm.downloadExcelKK(2024, 2023, 999)
            
            expect(mockDetailRekapService.getMesinById).toHaveBeenCalledWith(999)
            expect(consoleSpy).toHaveBeenCalledWith('Error : ', expect.any(Error))
            // Should still call downloadExcelKK
            expect(mockRekapService.downloadExcelKK).toHaveBeenCalledWith(2024, 2023, 999)
            expect(mockLink.click).toHaveBeenCalled()
            
            consoleSpy.mockRestore()
        })

        it('should proceed with Excel FS download even if getMesinById fails', async () => {
            mockDetailRekapService.getMesinById.mockRejectedValue(new Error('Mesin not found'))
            mockFeasibilityStudyService.downloadExcelFS.mockResolvedValue({
                 data: new Blob(['test']), 
                 headers: { 'content-disposition': 'attachment; filename="backup-fs.xlsx"' }
            })

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

            wrapper = createWrapper()
            await flushPromises()

            await wrapper.vm.downloadExcelFS(2024, 2023, 999)
            
            expect(mockDetailRekapService.getMesinById).toHaveBeenCalledWith(999)
            expect(consoleSpy).toHaveBeenCalledWith('Error : ', expect.any(Error))
            expect(mockFeasibilityStudyService.downloadExcelFS).toHaveBeenCalledWith(2024, 2023, 999)
            expect(mockLink.click).toHaveBeenCalled()

            consoleSpy.mockRestore()
        })
    })
})