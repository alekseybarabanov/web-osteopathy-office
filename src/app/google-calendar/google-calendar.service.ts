import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GoogleCalendarConfigService } from './google-calendar.config';

declare var google: any;
declare var gapi: any;

export interface CalendarEvent {
  id: string;
  summary: string;
  start: Date;
  end: Date;
  description?: string;
  allDay: boolean;
  calendarName: string;
  color: string;
}

@Injectable({ providedIn: 'root' })
export class GoogleCalendarService {
  private authenticated$ = new BehaviorSubject<boolean>(false);
  private events$ = new BehaviorSubject<CalendarEvent[]>([]);
  private tokenClient: any;
  private gapiLoaded = false;
  private gisLoaded = false;
  private calendarMeta: Map<string, { name: string; color: string }> = new Map();

  constructor(
    private ngZone: NgZone,
    private configService: GoogleCalendarConfigService
  ) {}

  get isAuthenticated(): Observable<boolean> {
    return this.authenticated$.asObservable();
  }

  get events(): Observable<CalendarEvent[]> {
    return this.events$.asObservable();
  }

  initGapiClient(): Promise<void> {
    return new Promise((resolve) => {
      gapi.load('client', async () => {
        await gapi.client.init({
          apiKey: this.configService.apiKey,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        });
        this.gapiLoaded = true;
        resolve();
      });
    });
  }

  initGisClient(): void {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.configService.clientId,
      scope: this.configService.scopes,
      callback: (response: any) => {
        this.ngZone.run(() => {
          if (response.error) {
            console.error('OAuth error:', response.error);
            return;
          }
          // Store token with expiry timestamp
          const tokenData = {
            ...response,
            expires_at: Date.now() + (response.expires_in || 3600) * 1000,
          };
          localStorage.setItem('gapi_token', JSON.stringify(tokenData));
          gapi.client.setToken(response);
          this.authenticated$.next(true);
          this.loadCalendarMeta().then(() => this.loadEvents(new Date()));
        });
      },
    });
    this.gisLoaded = true;
    // Try to restore token from session instead of prompting
    this.tryRestoreToken();
  }

  private tryRestoreToken(): void {
    const stored = localStorage.getItem('gapi_token');
    if (stored) {
      const token = JSON.parse(stored);
      if (token.expires_at && Date.now() >= token.expires_at) {
        // Token expired, silently request a new one
        localStorage.removeItem('gapi_token');
        this.tokenClient.requestAccessToken({ prompt: '' });
        return;
      }
      gapi.client.setToken(token);
      this.authenticated$.next(true);
      this.loadCalendarMeta().then(() => this.loadEvents(new Date()));
    }
  }

  signIn(): void {
    if (!this.gisLoaded) {
      console.error('GIS client not loaded yet');
      return;
    }
    this.tokenClient.requestAccessToken({ prompt: '' });
  }

  signOut(): void {
    const token = gapi.client.getToken();
    if (token) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken(null);
    }
    localStorage.removeItem('gapi_token');
    this.authenticated$.next(false);
    this.events$.next([]);
  }

  private loadCalendarMeta(): Promise<void> {
    return gapi.client.calendar.calendarList
      .list()
      .then((response: any) => {
        const items = response.result.items || [];
        const configIds = new Set(this.configService.calendarIds);
        for (const item of items) {
          if (configIds.has(item.id) || (configIds.has('primary') && item.primary)) {
            this.calendarMeta.set(item.id, {
              name: item.summary || item.id,
              color: item.backgroundColor || '#4285f4',
            });
          }
        }
      })
      .catch((err: any) => {
        console.error('Error loading calendar list:', err);
      });
  }

  loadEvents(monthDate: Date): void {
    const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);
    const calendarIds = this.configService.calendarIds;

    const requests = calendarIds.map((calId) => {
      const meta = this.calendarMeta.get(calId) || { name: calId, color: '#4285f4' };
      return gapi.client.calendar.events
        .list({
          calendarId: calId,
          timeMin: start.toISOString(),
          timeMax: end.toISOString(),
          showDeleted: false,
          singleEvents: true,
          orderBy: 'startTime',
          maxResults: 250,
        })
        .then((response: any) => ({
          items: response.result.items || [],
          calendarName: meta.name,
          color: meta.color,
        }))
        .catch((err: any) => {
          console.error(`Error loading calendar "${meta.name}":`, err);
          return { items: [], calendarName: meta.name, color: meta.color };
        });
    });

    Promise.all(requests).then((results) => {
      this.ngZone.run(() => {
        const allEvents: CalendarEvent[] = [];
        for (const result of results) {
          for (const item of result.items) {
            allEvents.push({
              id: item.id,
              summary: item.summary || '(Без названия)',
              start: new Date(item.start.dateTime || item.start.date),
              end: new Date(item.end.dateTime || item.end.date),
              description: item.description,
              allDay: !item.start.dateTime,
              calendarName: result.calendarName,
              color: result.color,
            });
          }
        }
        allEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
        this.events$.next(allEvents);
      });
    });
  }
}
