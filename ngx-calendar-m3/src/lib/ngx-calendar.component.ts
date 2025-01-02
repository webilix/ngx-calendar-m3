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
    @HostBinding('className') private className: string = 'ngx-calendar-m3';
    @HostBinding('style.--ngx-calendar-m3-width') cssWidth = '';
    @HostBinding('style.--ngx-calendar-m3-height') cssHeight = '';

    @Input({ required: true }) calendars!: NgxCalendar[];
    @Input({ required: false }) minDate?: 'NOW' | Date;
    @Input({ required: false }) maxDate?: 'NOW' | Date;
    @Input({ required: false }) width?: string;
    @Input({ required: false }) height: string = '40px';
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

    private jalali = JalaliDateTime();
    public list: NgxCalendar[] = ['DATE', 'WEEK', 'MONTH', 'YEAR', 'PERIOD'];
    public calendarsList: {
        [key in NgxCalendar]: {
            title: string;
            icon: string;
            method: (v: number, d?: Date, t?: string) => JalaliDateTimePeriod;
        };
    } = {
        DATE: { title: 'روزانه', icon: 'today', method: this.jalali.periodDay },
        WEEK: { title: 'هفتگی', icon: 'date_range', method: this.jalali.periodWeek },
        MONTH: { title: 'ماهانه', icon: 'calendar_month', method: this.jalali.periodMonth },
        YEAR: { title: 'سالانه', icon: 'calendar_today', method: this.jalali.periodYear },
        PERIOD: { title: 'دوره زمانی', icon: 'event_note', method: this.jalali.periodDay },
    };

    constructor(
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly ngxCalendarService: NgxCalendarService,
    ) {}

    ngOnInit(): void {
        this.cssWidth = this.width || '100%';
        this.cssHeight = this.height;

        this.calendars = this.calendars
            .filter((calendar) => !!this.calendarsList[calendar])
            .filter((calendar, index, arr) => arr.indexOf(calendar) === index);
        if (this.calendars.length === 0) this.calendars = ['DATE', 'WEEK', 'MONTH', 'YEAR', 'PERIOD'];

        let { minDate, maxDate } = this.getMinMax();

        // Check MIN and MAX Dates
        if (minDate && maxDate && minDate.getTime() > maxDate.getTime()) {
            const date: Date = new Date(minDate);
            minDate = maxDate;
            maxDate = date;
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

    getMinMax(): { minDate: Date | undefined; maxDate: Date | undefined } {
        const minDate: Date | undefined = this.minDate === 'NOW' ? new Date() : this.minDate;
        const maxDate: Date | undefined = this.maxDate === 'NOW' ? new Date() : this.maxDate;

        return { minDate, maxDate };
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

        const { minDate, maxDate } = this.getMinMax();

        // Update Previous and Next
        if (this.calendar !== 'PERIOD') {
            const previousCheck = minDate ? this.calendarsList[this.calendar].method(1, minDate).from : undefined;
            this.previous.date = this.calendarsList[this.calendar].method(1, new Date(this.from.getTime() - 1)).from;
            this.previous.active = !previousCheck || this.previous.date.getTime() >= previousCheck.getTime();

            const nextCheck = maxDate ? this.calendarsList[this.calendar].method(1, maxDate).to : undefined;
            this.next.date = this.calendarsList[this.calendar].method(1, new Date(this.to.getTime() + 1)).to;
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
        const { minDate, maxDate } = this.getMinMax();
        const checkDate = (date: Date): Date => {
            if (minDate && date.getTime() < minDate.getTime()) date = minDate;
            if (maxDate && date.getTime() > maxDate.getTime()) date = maxDate;
            return date;
        };

        this.calendar = calendar;
        this.calendarTitle = this.calendarsList[this.calendar].title;
        const date: Date = checkDate(from || new Date());

        switch (this.calendar) {
            case 'DATE':
            case 'WEEK':
            case 'MONTH':
            case 'YEAR':
                const period: JalaliDateTimePeriod = this.calendarsList[this.calendar].method(1, date);
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
        this.to = this.calendarsList[this.calendar].method(1, this.previous.date).to;

        this.updateView();
    }

    setNext(): void {
        if (this.calendar === 'PERIOD' || !this.next.active) return;
        this.from = this.calendarsList[this.calendar].method(1, this.next.date).from;
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
