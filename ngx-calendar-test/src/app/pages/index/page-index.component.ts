import { Component } from '@angular/core';

import { MatButton } from '@angular/material/button';

import {
    INgxCalendar,
    INgxCalendarDate,
    INgxCalendarMonth,
    INgxCalendarWeek,
    INgxCalendarYear,
    NgxCalendarComponent,
    NgxCalendarDateComponent,
    NgxCalendarMonthComponent,
    NgxCalendarService,
    NgxCalendarWeekComponent,
    NgxCalendarYearComponent,
} from '@webilix/ngx-calendar-m3';
import { NgxHelperDatePipe } from '@webilix/ngx-helper-m3';

type Container = 'DIALOG' | 'BOTTOMSHEET';

@Component({
    host: { selector: 'page-index' },
    imports: [
        MatButton,
        NgxCalendarComponent,
        NgxCalendarDateComponent,
        NgxCalendarWeekComponent,
        NgxCalendarMonthComponent,
        NgxCalendarYearComponent,
        NgxHelperDatePipe,
    ],
    templateUrl: './page-index.component.html',
    styleUrl: './page-index.component.scss',
})
export class PageIndexComponent {
    constructor(private readonly ngxCalendarService: NgxCalendarService) {}

    public calendarMinDate?: Date = new Date(new Date().getTime() - 365 * 24 * 3600 * 1000);
    public calendarMaxDate?: Date = new Date(new Date().getTime() + 365 * 24 * 3600 * 1000);
    setCalendar(calendar: INgxCalendar): void {
        console.log('CALENDAR CHANGE:', calendar);
    }

    //#region DATE
    public date?: Date;
    public dateContainer: Container = 'DIALOG';

    getDate(type?: 'MIN' | 'MAX'): void {
        const date = this.ngxCalendarService.getDate({
            value: this.date,
            minDate: type === 'MIN' ? new Date() : undefined,
            maxDate: type === 'MAX' ? new Date() : undefined,
        });

        switch (this.dateContainer) {
            case 'DIALOG':
                date.dialog((value) => (this.date = value.date));
                break;
            case 'BOTTOMSHEET':
                date.bottomSheet((value) => (this.date = value.date));
                break;
        }
    }

    setDate(value: INgxCalendarDate): void {
        this.date = value.date;
    }
    //#endregion

    //#region WEEK
    public week?: { from: Date; to: Date };
    public weekContainer: Container = 'DIALOG';

    getWeek(type?: 'MIN' | 'MAX'): void {
        const week = this.ngxCalendarService.getWeek({
            value: this.week,
            minDate: type === 'MIN' ? new Date() : undefined,
            maxDate: type === 'MAX' ? new Date() : undefined,
        });

        switch (this.weekContainer) {
            case 'DIALOG':
                week.dialog((value) => (this.week = value.period));
                break;
            case 'BOTTOMSHEET':
                week.bottomSheet((value) => (this.week = value.period));
                break;
        }
    }

    setWeek(value: INgxCalendarWeek): void {
        this.week = value.period;
    }
    //#endregion

    //#region MONTH
    public month?: { from: Date; to: Date };
    public monthContainer: Container = 'DIALOG';

    getMonth(type?: 'MIN' | 'MAX'): void {
        const month = this.ngxCalendarService.getMonth({
            value: this.month,
            minDate: type === 'MIN' ? new Date() : undefined,
            maxDate: type === 'MAX' ? new Date() : undefined,
        });

        switch (this.monthContainer) {
            case 'DIALOG':
                month.dialog((value) => (this.month = value.period));
                break;
            case 'BOTTOMSHEET':
                month.bottomSheet((value) => (this.month = value.period));
                break;
        }
    }

    setMonth(value: INgxCalendarMonth): void {
        this.month = value.period;
    }
    //#endregion

    //#region YEAR
    public year?: { from: Date; to: Date };
    public yearContainer: Container = 'DIALOG';

    getYear(type?: 'MIN' | 'MAX'): void {
        const year = this.ngxCalendarService.getYear({
            value: this.year,
            minDate: type === 'MIN' ? new Date() : undefined,
            maxDate: type === 'MAX' ? new Date() : undefined,
        });

        switch (this.yearContainer) {
            case 'DIALOG':
                year.dialog((value) => (this.year = value.period));
                break;
            case 'BOTTOMSHEET':
                year.bottomSheet((value) => (this.year = value.period));
                break;
        }
    }

    setYear(value: INgxCalendarYear): void {
        this.year = value.period;
    }
    //#endregion
}
