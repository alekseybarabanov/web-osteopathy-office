import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface GoogleCalendarConfig {
  googleClientId: string;
  googleApiKey: string;
  googleCalendarIds: string[];
}

@Injectable({ providedIn: 'root' })
export class GoogleCalendarConfigService {
  private config: GoogleCalendarConfig | null = null;

  constructor(private http: HttpClient) {}

  load(): Promise<void> {
    return firstValueFrom(this.http.get<GoogleCalendarConfig>('/assets/config.json'))
      .then((config) => {
        this.config = config;
      });
  }

  get clientId(): string {
    return this.config?.googleClientId || '';
  }

  get apiKey(): string {
    return this.config?.googleApiKey || '';
  }

  get calendarIds(): string[] {
    return this.config?.googleCalendarIds || [];
  }

  get scopes(): string {
    return 'https://www.googleapis.com/auth/calendar.readonly';
  }
}
