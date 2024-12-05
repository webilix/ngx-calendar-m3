import { Component } from '@angular/core';

import { MatButton } from '@angular/material/button';

import {
    INgxCalendarDate,
    INgxCalendarWeek,
    NgxCalendarDateComponent,
    NgxCalendarService,
    NgxCalendarWeekComponent,
    NgxCalendatDatePipe,
    NgxCalendatWeekPipe,
} from '@webilix/ngx-calendar-m3';

type Container = 'DIALOG' | 'BOTTOMSHEET';

@Component({
    host: { selector: 'page-index' },
    imports: [MatButton, NgxCalendarDateComponent, NgxCalendatDatePipe, NgxCalendarWeekComponent, NgxCalendatWeekPipe],
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
}
