import { Component } from '@angular/core';

import { MatButton } from '@angular/material/button';

import {
    INgxCalendarDate,
    INgxCalendarMonth,
    INgxCalendarWeek,
    NgxCalendarDateComponent,
    NgxCalendarMonthComponent,
    NgxCalendarService,
    NgxCalendarWeekComponent,
    NgxCalendatDatePipe,
    NgxCalendatMonthPipe,
    NgxCalendatWeekPipe,
} from '@webilix/ngx-calendar-m3';

type Container = 'DIALOG' | 'BOTTOMSHEET';

@Component({
    host: { selector: 'page-index' },
    imports: [
        MatButton,
        NgxCalendarDateComponent,
        NgxCalendatDatePipe,
        NgxCalendarWeekComponent,
        NgxCalendatWeekPipe,
        NgxCalendarMonthComponent,
        NgxCalendatMonthPipe,
    ],
    templateUrl: './page-index.component.html',
    styleUrl: './page-index.component.scss',
})
export class PageIndexComponent {
    constructor(private readonly ngxCalendarService: NgxCalendarService) {}

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
}
