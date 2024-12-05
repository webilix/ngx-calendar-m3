import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import {
    NgxCalendarDateComponent,
    NgxCalendarMonthComponent,
    NgxCalendarWeekComponent,
    NgxCalendarYearComponent,
} from '../../components';
import { NgxCalendar } from '../../ngx-calendar.interface';

import { IContainer } from '../container.interface';

@Component({
    host: { selector: 'dialog' },
    imports: [
        MatDialogModule,
        MatIconButton,
        MatIcon,
        NgxCalendarDateComponent,
        NgxCalendarWeekComponent,
        NgxCalendarMonthComponent,
        NgxCalendarYearComponent,
    ],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
})
export class DialogComponent<R> {
    public data: { calendar: NgxCalendar; container: IContainer } = inject(MAT_DIALOG_DATA);

    constructor(private readonly matDialogRef: MatDialogRef<DialogComponent<R>>) {}

    closeContainer(data?: any): void {
        this.matDialogRef.close(data);
    }
}
