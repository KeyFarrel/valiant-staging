// SpeechRecognitionService.ts

export default class SpeechRecognitionService {
  private recognition: SpeechRecognition;
  public isListening: boolean;
  public searchQuery: string;

  constructor(language: string = 'id-ID') {
    this.isListening = false;
    this.searchQuery = '';
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.lang = language;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = this.handleStart.bind(this);
    this.recognition.onend = this.handleEnd.bind(this);
    this.recognition.onresult = this.handleResult.bind(this);
    this.recognition.onerror = this.handleError.bind(this);
  }

  private handleStart(): void {
    console.log('Speech recognition dimulai');
    this.isListening = true;
  }

  private handleEnd(): void {
    this.isListening = false;
  }

  private handleResult(event: SpeechRecognitionEvent): void {
    const transcript = event.results[0][0].transcript;
    this.searchQuery = transcript;
  }

  private handleError(event: SpeechRecognitionErrorEvent): void {
    console.error('Speech recognition error', event);
  }

  public startListening(): void {
    this.recognition.start();
  }

  public stopListening(): void {
    this.recognition.stop();
  }

  public getSearchQuery(): string {
    return this.searchQuery;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}
