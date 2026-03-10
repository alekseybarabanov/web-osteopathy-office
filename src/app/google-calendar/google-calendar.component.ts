import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { GoogleCalendarService, CalendarEvent } from './google-calendar.service';
import { GoogleCalendarConfigService } from './google-calendar.config';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

interface HourEvent {
  event: CalendarEvent;
  isStart: boolean;
}

interface HourSlot {
  hour: number;
  label: string;
  events: HourEvent[];
}

@Component({
    selector: 'app-google-calendar',
    templateUrl: './google-calendar.component.html',
    styleUrls: ['./google-calendar.component.css'],
    standalone: false
})
export class GoogleCalendarComponent implements OnInit, OnDestroy {
  @Output() eventClicked = new EventEmitter<string>();
  authenticated = false;
  currentMonth = new Date();
  weeks: CalendarDay[][] = [];
  dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  selectedDay: CalendarDay | null = null;
  hourSlots: HourSlot[] = [];
  allDayEvents: CalendarEvent[] = [];
  monthCollapsed = true;

  private authSub!: Subscription;
  private eventsSub!: Subscription;
  private events: CalendarEvent[] = [];

  constructor(
    private calendarService: GoogleCalendarService,
    private configService: GoogleCalendarConfigService
  ) {}

  ngOnInit(): void {
    this.buildCalendar();
    this.selectToday();

    this.authSub = this.calendarService.isAuthenticated.subscribe((auth) => {
      this.authenticated = auth;
    });

    this.eventsSub = this.calendarService.events.subscribe((events) => {
      this.events = events;
      this.buildCalendar();
      // Re-select the same day to refresh its events
      if (this.selectedDay) {
        const selDate = this.selectedDay.date;
        const day = this.findDay(selDate);
        if (day) {
          this.selectDay(day);
        }
      }
    });

    this.configService.load().then(() => this.loadGoogleScripts());
  }

  private selectToday(): void {
    const today = new Date();
    const day = this.findDay(today);
    if (day) {
      this.selectDay(day);
    }
  }

  private findDay(date: Date): CalendarDay | null {
    for (const week of this.weeks) {
      for (const day of week) {
        if (
          day.date.getDate() === date.getDate() &&
          day.date.getMonth() === date.getMonth() &&
          day.date.getFullYear() === date.getFullYear()
        ) {
          return day;
        }
      }
    }
    return null;
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.eventsSub?.unsubscribe();
  }

  private loadGoogleScripts(): void {
    const gapiScript = document.createElement('script');
    gapiScript.src = 'https://apis.google.com/js/api.js';
    gapiScript.onload = () => {
      this.calendarService.initGapiClient().then(() => {
        const gisScript = document.createElement('script');
        gisScript.src = 'https://accounts.google.com/gsi/client';
        gisScript.onload = () => {
          this.calendarService.initGisClient();
        };
        document.head.appendChild(gisScript);
      });
    };
    document.head.appendChild(gapiScript);
  }

  onEventClick(event: CalendarEvent): void {
    const match = event.summary.match(/^[a-zA-Zа-яА-ЯёЁ\s]+/);
    const wordsOnly = match ? match[0].trim() : '';
    this.eventClicked.emit(wordsOnly);
  }

  signIn(): void {
    this.calendarService.signIn();
  }

  signOut(): void {
    this.calendarService.signOut();
    this.selectedDay = null;
  }

  prevMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.buildCalendar();
    if (this.authenticated) {
      this.calendarService.loadEvents(this.currentMonth);
    }
  }

  nextMonth(): void {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.buildCalendar();
    if (this.authenticated) {
      this.calendarService.loadEvents(this.currentMonth);
    }
  }

  prevDay(): void {
    if (!this.selectedDay) return;
    const prev = new Date(this.selectedDay.date);
    prev.setDate(prev.getDate() - 1);
    this.navigateToDate(prev);
  }

  nextDay(): void {
    if (!this.selectedDay) return;
    const next = new Date(this.selectedDay.date);
    next.setDate(next.getDate() + 1);
    this.navigateToDate(next);
  }

  private navigateToDate(date: Date): void {
    // Switch month if needed
    if (
      date.getMonth() !== this.currentMonth.getMonth() ||
      date.getFullYear() !== this.currentMonth.getFullYear()
    ) {
      this.currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      this.buildCalendar();
      if (this.authenticated) {
        this.calendarService.loadEvents(this.currentMonth);
      }
    }
    const day = this.findDay(date);
    if (day) {
      this.selectDay(day);
    }
  }

  selectDay(day: CalendarDay): void {
    this.selectedDay = day;
    this.monthCollapsed = true;
    this.buildDaySchedule(day);
  }

  isSelected(day: CalendarDay): boolean {
    if (!this.selectedDay) return false;
    return (
      day.date.getDate() === this.selectedDay.date.getDate() &&
      day.date.getMonth() === this.selectedDay.date.getMonth() &&
      day.date.getFullYear() === this.selectedDay.date.getFullYear()
    );
  }

  get selectedDayName(): string {
    if (!this.selectedDay) return '';
    return this.selectedDay.date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }

  eventDuration(event: CalendarEvent): string {
    const startMin = new Date(event.start).getHours() * 60 + new Date(event.start).getMinutes();
    const endMin = new Date(event.end).getHours() * 60 + new Date(event.end).getMinutes();
    const diff = endMin - startMin;
    if (diff < 60) return `${diff} мин`;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return m > 0 ? `${h} ч ${m} мин` : `${h} ч`;
  }

  private buildDaySchedule(day: CalendarDay): void {
    this.allDayEvents = day.events.filter((e) => e.allDay);
    const timedEvents = day.events.filter((e) => !e.allDay);

    // Find the first and last hours with events
    let firstEventHour = 21;
    let lastEventHour = 7;
    for (const e of timedEvents) {
      const startHour = new Date(e.start).getHours();
      const endDate = new Date(e.end);
      const endHour = endDate.getMinutes() > 0 ? endDate.getHours() : endDate.getHours() - 1;
      if (startHour < firstEventHour) firstEventHour = startHour;
      if (endHour > lastEventHour) lastEventHour = endHour;
    }
    const startFrom = timedEvents.length > 0 ? firstEventHour : 7;
    const endAt = timedEvents.length > 0 ? lastEventHour : 7;

    this.hourSlots = [];
    for (let h = startFrom; h <= endAt; h++) {
      const hourEvents: HourEvent[] = [];
      for (const e of timedEvents) {
        const startHour = new Date(e.start).getHours();
        const endDate = new Date(e.end);
        // End hour: if event ends exactly on the hour (e.g. 16:00), it doesn't occupy that hour
        const endHour = endDate.getMinutes() > 0 ? endDate.getHours() : endDate.getHours() - 1;
        if (h >= startHour && h <= endHour) {
          hourEvents.push({ event: e, isStart: h === startHour });
        }
      }
      this.hourSlots.push({
        hour: h,
        label: `${h.toString().padStart(2, '0')}:00`,
        events: hourEvents,
      });
    }
  }

  get monthName(): string {
    return this.currentMonth.toLocaleString('ru-RU', {
      month: 'long',
      year: 'numeric',
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private buildCalendar(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const today = new Date();

    const firstDay = new Date(year, month, 1);
    // Monday-based week: 0=Mon, 6=Sun
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    const days: CalendarDay[] = [];

    // Previous month fill
    for (let i = startDow - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: this.getEventsForDate(date),
      });
    }

    // Current month
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month, d);
      days.push({
        date,
        isCurrentMonth: true,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
        events: this.getEventsForDate(date),
      });
    }

    // Next month fill
    while (days.length % 7 !== 0) {
      const date = new Date(year, month + 1, days.length - totalDays - startDow + 1);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        events: this.getEventsForDate(date),
      });
    }

    // Split into weeks
    this.weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      this.weeks.push(days.slice(i, i + 7));
    }
  }

  private getEventsForDate(date: Date): CalendarEvent[] {
    return this.events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  }
}
