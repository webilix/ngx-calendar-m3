import { Component } from '@angular/core';

import { MatButton } from '@angular/material/button';

import {
    INgxCalendarDate,
    NgxCalendarDateComponent,
    NgxCalendarService,
    NgxCalendatDatePipe,
} from '@webilix/ngx-calendar-m3';

type Container = 'DIALOG' | 'BOTTOMSHEET';

@Component({
    host: { selector: 'page-index' },
    imports: [MatButton, NgxCalendarDateComponent, NgxCalendatDatePipe],
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
}
