import { Component } from '@angular/core';

import { MatButton } from '@angular/material/button';

import {
    INgxCalendar,
    INgxCalendarDate,
    INgxCalendarDateTime,
    INgxCalendarMonth,
    INgxCalendarWeek,
    INgxCalendarYear,
    NgxCalendarComponent,
    NgxCalendarDateComponent,
    NgxCalendarDateTimeComponent,
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
        NgxCalendarDateTimeComponent,
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

    public calendarMinDate: Date = new Date(new Date().getTime() - 365 * 24 * 3600 * 1000);
    public calendarMaxDate: Date = new Date(new Date().getTime() + 365 * 24 * 3600 * 1000);
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

        const onResponse = (value: INgxCalendarDate) => (this.date = value.date);
        const onDismiss = () => console.log('DISMISSED');
        switch (this.dateContainer) {
            case 'DIALOG':
                date.dialog(onResponse, onDismiss);
                break;
            case 'BOTTOMSHEET':
                date.bottomSheet(onResponse, onDismiss);
                break;
        }
    }

    setDate(value: INgxCalendarDate): void {
        this.date = value.date;
    }
    //#endregion

    //#region DATE TIME
    public dateTime?: Date;
    public dateTimeContainer: Container = 'DIALOG';

    getDateTime(type?: 'MIN' | 'MAX'): void {}

    setDateTime(value: INgxCalendarDateTime): void {
        this.dateTime = value.date;
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

        const onResponse = (value: INgxCalendarWeek) => (this.week = value.period);
        const onDismiss = () => console.log('DISMISSED');
        switch (this.weekContainer) {
            case 'DIALOG':
                week.dialog(onResponse, onDismiss);
                break;
            case 'BOTTOMSHEET':
                week.bottomSheet(onResponse, onDismiss);
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

        const onResponse = (value: INgxCalendarMonth) => (this.month = value.period);
        const onDismiss = () => console.log('DISMISSED');
        switch (this.monthContainer) {
            case 'DIALOG':
                month.dialog(onResponse, onDismiss);
                break;
            case 'BOTTOMSHEET':
                month.bottomSheet(onResponse, onDismiss);
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

        const onResponse = (value: INgxCalendarYear) => (this.year = value.period);
        const onDismiss = () => console.log('DISMISSED');
        switch (this.yearContainer) {
            case 'DIALOG':
                year.dialog(onResponse, onDismiss);
                break;
            case 'BOTTOMSHEET':
                year.bottomSheet(onResponse, onDismiss);
                break;
        }
    }

    setYear(value: INgxCalendarYear): void {
        this.year = value.period;
    }
    //#endregion
}
