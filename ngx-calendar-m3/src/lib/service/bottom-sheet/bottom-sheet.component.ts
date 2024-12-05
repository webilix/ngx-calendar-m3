import { Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { NgxCalendarDateComponent, NgxCalendarWeekComponent } from '../../components';
import { NgxCalendar } from '../../ngx-calendar.interface';

import { IContainer } from '../container.interface';

@Component({
    host: { selector: 'bottom-sheet' },
    imports: [MatIconButton, MatIcon, NgxCalendarDateComponent, NgxCalendarWeekComponent],
    templateUrl: './bottom-sheet.component.html',
    styleUrl: './bottom-sheet.component.scss',
})
export class BottomSheetComponent<R> {
    public data: { calendar: NgxCalendar; container: IContainer } = inject(MAT_BOTTOM_SHEET_DATA);

    constructor(private readonly matBottomSheetRef: MatBottomSheetRef<BottomSheetComponent<R>>) {}

    closeContainer(data?: any): void {
        this.matBottomSheetRef.dismiss(data);
    }
}
