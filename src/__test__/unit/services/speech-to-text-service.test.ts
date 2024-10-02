import SpeechRecognitionService from '@/services/speech-to-text-service'; // Sesuaikan dengan path yang benar

// Mock the SpeechRecognition and related APIs
const mockRecognitionStart = jest.fn();
const mockRecognitionStop = jest.fn();
const mockRecognition = jest.fn().mockImplementation(() => ({
  start: mockRecognitionStart,
  stop: mockRecognitionStop,
  lang: '',
  interimResults: false,
  maxAlternatives: 1,
  onstart: null,
  onend: null,
  onresult: null,
  onerror: null,
}));

// Attach the mock to the window object
window.SpeechRecognition = mockRecognition;
window.webkitSpeechRecognition = mockRecognition;

describe('SpeechRecognitionService', () => {
  let service: SpeechRecognitionService;

  beforeEach(() => {
    service = new SpeechRecognitionService('en-US'); // Set language to English for test purposes
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize SpeechRecognition with the correct language and default settings', () => {
    expect(mockRecognition).toHaveBeenCalledTimes(1);
    expect(service).toBeTruthy();
    expect(service['recognition'].lang).toBe('en-US'); // Language passed to constructor
    expect(service['recognition'].interimResults).toBe(false);
    expect(service['recognition'].maxAlternatives).toBe(1);
  });

  it('should use the default language when no language is provided', () => {
    const defaultService = new SpeechRecognitionService(); // No language passed, default should be 'id-ID'
    
    expect(defaultService['recognition'].lang).toBe('id-ID'); // Default language should be 'id-ID'
  });

  it('should start speech recognition when startListening is called', () => {
    const mockStartEvent = new Event('start');

    // Simulate the speech recognition start
    service.startListening();

    // Trigger the recognition start event
    service['recognition'].onstart?.(mockStartEvent);
    expect(mockRecognitionStart).toHaveBeenCalled();
    expect(service.getIsListening()).toBe(true);
  });

  it('should stop speech recognition when stopListening is called', () => {
    const mockEndEvent = new Event('end');

    // Simulate the speech recognition stop
    service.startListening();
    service.stopListening();

    // Trigger the recognition end event
    service['recognition'].onend?.(mockEndEvent);
    expect(mockRecognitionStop).toHaveBeenCalled();
    expect(service.getIsListening()).toBe(false);
  });

  it('should update isListening when recognition starts and ends', () => {
    const mockStartEvent = new Event('start');
    const mockEndEvent = new Event('end');

    // Trigger the recognition start event
    service['recognition'].onstart?.(mockStartEvent);
    expect(service.getIsListening()).toBe(true);

    // Trigger the recognition end event
    service['recognition'].onend?.(mockEndEvent);
    expect(service.getIsListening()).toBe(false);
  });

  it('should update searchQuery when recognition result is received', () => {
    const mockResultEvent = {
      results: [[{ transcript: 'test search query' }]],
    } as unknown as SpeechRecognitionEvent;

    // Trigger the recognition result event
    service['recognition'].onresult?.(mockResultEvent);
    expect(service.getSearchQuery()).toBe('test search query');
  });

  it('should handle recognition errors gracefully', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockErrorEvent = { error: 'network' } as unknown as SpeechRecognitionErrorEvent;

    // Trigger the recognition error event
    service['recognition'].onerror?.(mockErrorEvent);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Speech recognition error', mockErrorEvent);

    consoleErrorSpy.mockRestore();
  });
});
