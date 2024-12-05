import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { Helper } from '@webilix/helper-library';
import { JalaliDateTime, JalaliDateTimePeriod } from '@webilix/jalali-date-time';

import {
    INgxCalendar,
    INgxCalendarDate,
    INgxCalendarMonth,
    INgxCalendarWeek,
    INgxCalendarYear,
    NgxCalendar,
} from './ngx-calendar.interface';
import { NgxCalendarService } from './ngx-calendar.service';

@Component({
    selector: 'ngx-calendar',
    imports: [MatIconButton, MatIcon, MatMenuModule],
    templateUrl: './ngx-calendar.component.html',
    styleUrl: './ngx-calendar.component.scss',
})
export class NgxCalendarComponent implements OnInit {
    @HostBinding('style.--width') cssWidth = '';
    @HostBinding('style.--height') cssHeight = '';

    @Input({ required: true }) calendars!: NgxCalendar[];
    @Input({ required: false }) minDate?: Date;
    @Input({ required: false }) maxDate?: Date;
    @Input({ required: false }) width?: number;
    @Input({ required: false }) height: number = 40;
    @Input({ required: false }) route: string[] = [];
    @Input({ required: false }) container: 'DIALOG' | 'BOTTONSHEET' = 'DIALOG';
    @Output() onChanged: EventEmitter<INgxCalendar> = new EventEmitter<INgxCalendar>();

    public calendar!: NgxCalendar;
    public calendarTitle!: string;
    public periodTitle!: string | [string, string];
    public from!: Date;
    public to!: Date;

    public previous: { active: boolean; date: Date } = { active: false, date: new Date() };
    public next: { active: boolean; date: Date } = { active: false, date: new Date() };

    public calendarsList: { calendar: NgxCalendar; title: string; icon: string }[] = [
        { calendar: 'DATE', title: 'روزانه', icon: 'today' },
        { calendar: 'WEEK', title: 'هفتگی', icon: 'date_range' },
        { calendar: 'MONTH', title: 'ماهانه', icon: 'calendar_month' },
        { calendar: 'YEAR', title: 'سالانه', icon: 'calendar_today' },
        { calendar: 'PERIOD', title: 'دوره زمانی', icon: 'event_note' },
    ];

    private jalali = JalaliDateTime();
    private methods: {
        [key in NgxCalendar]: (v: number, d?: Date, t?: string) => JalaliDateTimePeriod;
    } = {
        DATE: this.jalali.periodDay,
        WEEK: this.jalali.periodWeek,
        MONTH: this.jalali.periodMonth,
        YEAR: this.jalali.periodYear,
        PERIOD: this.jalali.periodDay,
    };

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly ngxCalendarService: NgxCalendarService,
    ) {}

    ngOnInit(): void {
        this.cssWidth = this.width ? `${this.width}px` : '100%';
        this.cssHeight = `${Math.max(32, this.height)}px`;

        this.calendars = this.calendars.filter((calendar) => this.calendarsList.find((c) => c.calendar === calendar));
        if (this.calendars.length === 0) this.calendars = ['DATE', 'WEEK', 'MONTH', 'YEAR', 'PERIOD'];

        // Check MIN and MAX Dates
        if (this.minDate && this.maxDate && this.minDate.getTime() > this.maxDate.getTime()) {
            const date: Date = this.minDate;
            this.minDate = this.maxDate;
            this.maxDate = date;
        }

        const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };
        const calendar: NgxCalendar =
            this.route.length > 0 && this.calendars.includes(queryParams['ngx-calendar'])
                ? queryParams['ngx-calendar']
                : this.calendars[0];
        const from: Date =
            this.route.length > 0 && Helper.IS.STRING.date(queryParams['ngx-calendar-from'])
                ? new Date(this.jalali.gregorian(queryParams['ngx-calendar-from']).date + 'T00:00:00.000Z')
                : new Date();
        const to: Date =
            this.route.length > 0 && Helper.IS.STRING.date(queryParams['ngx-calendar-to'])
                ? new Date(this.jalali.gregorian(queryParams['ngx-calendar-to']).date + 'T00:00:00.000Z')
                : new Date();

        this.setCalendar(calendar, from, to);
    }

    updateView(): void {
        switch (this.calendar) {
            case 'DATE':
                this.periodTitle = this.jalali.toTitle(this.from, { format: 'W، d N Y' });
                break;
            case 'WEEK':
                this.periodTitle = Helper.DATE.jalaliPeriod(this.from, this.to).replace('-', ' تا ');
                break;
            case 'MONTH':
                this.periodTitle = this.jalali.toTitle(this.from, { format: 'N Y' });
                break;
            case 'YEAR':
                this.periodTitle = this.jalali.toTitle(this.from, { format: 'Y' });
                break;
            case 'PERIOD':
                this.periodTitle = [
                    this.jalali.toTitle(this.from, { format: 'd N Y' }),
                    this.jalali.toTitle(this.to, { format: 'd N Y' }),
                ];
                break;
        }

        // Update Previous and Next
        if (this.calendar !== 'PERIOD') {
            const previousCheck = this.minDate ? this.methods[this.calendar](1, this.minDate).from : undefined;
            this.previous.date = this.methods[this.calendar](1, new Date(this.from.getTime() - 1)).from;
            this.previous.active = !previousCheck || this.previous.date.getTime() >= previousCheck.getTime();

            const nextCheck = this.maxDate ? this.methods[this.calendar](1, this.maxDate).to : undefined;
            this.next.date = this.methods[this.calendar](1, new Date(this.to.getTime() + 1)).to;
            this.next.active = !nextCheck || this.next.date.getTime() <= nextCheck.getTime();
        }

        // Update Routes
        if (this.route.length !== 0) {
            const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };

            queryParams['ngx-calendar'] = this.calendar;
            queryParams['ngx-calendar-from'] = this.jalali.toString(this.from, { format: 'Y-M-D' });
            queryParams['ngx-calendar-to'] = this.jalali.toString(this.to, { format: 'Y-M-D' });
            this.router.navigate(this.route, { queryParams });
        }

        const title: string =
            typeof this.periodTitle === 'string'
                ? this.periodTitle
                : Helper.DATE.jalaliPeriod(this.from, this.to).replace('-', ' تا ');
        this.onChanged.next({
            calendar: this.calendar,
            period: { from: this.from, to: this.to },
            title,
        });
    }

    setCalendar(calendar: NgxCalendar, from?: Date, to?: Date): void {
        const checkDate = (date: Date): Date => {
            if (this.minDate && date.getTime() < this.minDate.getTime()) date = this.minDate;
            if (this.maxDate && date.getTime() > this.maxDate.getTime()) date = this.maxDate;
            return date;
        };

        this.calendar = calendar;
        this.calendarTitle = this.calendarsList.find((c) => c.calendar === this.calendar)?.title || '';
        const date: Date = checkDate(from || new Date());

        switch (this.calendar) {
            case 'DATE':
            case 'WEEK':
            case 'MONTH':
            case 'YEAR':
                const period: JalaliDateTimePeriod = this.methods[this.calendar](1, date);
                this.from = period.from;
                this.to = period.to;
                break;
            case 'PERIOD':
                this.from = checkDate(this.jalali.periodMonth(1, date).from);
                this.to = checkDate(this.jalali.periodDay(1, checkDate(to || date)).to);
                break;
        }

        this.updateView();
    }

    setPrevious(): void {
        if (this.calendar === 'PERIOD' || !this.previous.active) return;
        this.from = this.previous.date;
        this.to = this.methods[this.calendar](1, this.previous.date).to;

        this.updateView();
    }

    setNext(): void {
        if (this.calendar === 'PERIOD' || !this.next.active) return;
        this.from = this.methods[this.calendar](1, this.next.date).from;
        this.to = this.next.date;

        this.updateView();
    }

    getDate(): void {
        const setDate = (date: INgxCalendarDate): void => {
            this.from = this.to = date.date;
            this.updateView();
        };

        const calendar = this.ngxCalendarService.getDate({ value: this.from, minDate: this.minDate, maxDate: this.maxDate });
        this.container === 'DIALOG' ? calendar.dialog(setDate) : calendar.bottomSheet(setDate);
    }

    getWeek(): void {
        const setWeek = (week: INgxCalendarWeek): void => {
            this.from = week.period.from;
            this.to = week.period.to;
            this.updateView();
        };

        const calendar = this.ngxCalendarService.getWeek({ value: this.from, minDate: this.minDate, maxDate: this.maxDate });
        this.container === 'DIALOG' ? calendar.dialog(setWeek) : calendar.bottomSheet(setWeek);
    }

    getMonth(): void {
        const setMonth = (week: INgxCalendarMonth): void => {
            this.from = week.period.from;
            this.to = week.period.to;
            this.updateView();
        };

        const calendar = this.ngxCalendarService.getMonth({
            value: this.from,
            minDate: this.minDate,
            maxDate: this.maxDate,
        });
        this.container === 'DIALOG' ? calendar.dialog(setMonth) : calendar.bottomSheet(setMonth);
    }

    getYear(): void {
        const setYear = (year: INgxCalendarYear): void => {
            this.from = year.period.from;
            this.to = year.period.to;
            this.updateView();
        };

        const calendar = this.ngxCalendarService.getYear({
            value: this.from,
            minDate: this.minDate,
            maxDate: this.maxDate,
        });
        this.container === 'DIALOG' ? calendar.dialog(setYear) : calendar.bottomSheet(setYear);
    }

    getPeriodFrom(): void {
        const setDate = (date: INgxCalendarDate): void => {
            this.from = date.date;
            this.updateView();
        };

        const calendar = this.ngxCalendarService.getDate({
            value: this.from,
            minDate: this.minDate,
            maxDate: this.to || this.maxDate,
        });
        this.container === 'DIALOG' ? calendar.dialog(setDate) : calendar.bottomSheet(setDate);
    }

    getPeriodTo(): void {
        const setDate = (date: INgxCalendarDate): void => {
            this.to = date.date;
            this.updateView();
        };

        const calendar = this.ngxCalendarService.getDate({
            value: this.to,
            minDate: this.from || this.minDate,
            maxDate: this.maxDate,
        });
        this.container === 'DIALOG' ? calendar.dialog(setDate) : calendar.bottomSheet(setDate);
    }
}
