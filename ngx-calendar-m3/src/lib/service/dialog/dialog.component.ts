import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { NgxCalendarDateComponent, NgxCalendarWeekComponent } from '../../components';
import { INgxCalendarOptions, NgxCalendar } from '../../ngx-calendar.interface';

@Component({
    host: { selector: 'dialog' },
    imports: [MatDialogModule, MatIconButton, MatIcon, NgxCalendarDateComponent, NgxCalendarWeekComponent],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
})
export class DialogComponent<R> {
    public data: {
        title: string;
        calendar: NgxCalendar;
        options: Partial<INgxCalendarOptions>;
    } = inject(MAT_DIALOG_DATA);

    constructor(private readonly matDialogRef: MatDialogRef<DialogComponent<R>>) {}

    closeContainer(data?: any): void {
        this.matDialogRef.close(data);
    }
}
