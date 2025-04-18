import { Component, inject } from '@angular/core';

import { NGX_HELPER_CONTAINER_CLOSE, NGX_HELPER_CONTAINER_DATA } from '@webilix/ngx-helper-m3';

import {
    NgxCalendarDateComponent,
    NgxCalendarMomentComponent,
    NgxCalendarMonthComponent,
    NgxCalendarWeekComponent,
    NgxCalendarYearComponent,
} from '../../components';
import { NgxCalendar } from '../../ngx-calendar.interface';

import { IContainer } from '../container.interface';

@Component({
    host: { selector: 'dialog' },
    imports: [
        NgxCalendarMomentComponent,
        NgxCalendarDateComponent,
        NgxCalendarWeekComponent,
        NgxCalendarMonthComponent,
        NgxCalendarYearComponent,
    ],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
})
export class DialogComponent<R> {
    public data: { calendar: NgxCalendar | 'MOMENT'; container: IContainer } = inject(NGX_HELPER_CONTAINER_DATA);
    public closeContainer = inject(NGX_HELPER_CONTAINER_CLOSE);
}
