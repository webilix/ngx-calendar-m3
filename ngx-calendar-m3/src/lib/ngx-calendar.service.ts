import { Injectable } from '@angular/core';

import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { BottomSheetComponent, DialogComponent } from './service';
import { INgxCalendarDate, INgxCalendarOptions, NgxCalendar } from './ngx-calendar.interface';

class NgxCalendarClass<R /* RESPONSE */> {
    constructor(
        private readonly calendar: NgxCalendar,
        private readonly matBottomSheet: MatBottomSheet,
        private readonly matDialog: MatDialog,
        private readonly options: Partial<INgxCalendarOptions>,
    ) {}

    private get title(): string {
        if (this.options.title) return this.options.title;

        switch (this.calendar) {
            case 'DATE':
                return 'انتخاب تاریخ';
            case 'WEEK':
                return 'انتخاب هفته';
            case 'MONTH':
                return 'انتخاب ماه';
            case 'YEAR':
                return 'انتخاب سال';
            case 'PERIOD':
                return 'انتخاب دوره زمانی';
        }
    }

    dialog(callback: (response: R) => void): void;
    dialog(callback: (response: R) => void, config: MatDialogConfig): void;
    dialog(callback: (response: R) => void, arg1?: any): void {
        const config: MatDialogConfig = arg1 || {};

        this.matDialog
            .open<any, any, R>(DialogComponent, {
                // DEFAULT CONFIG
                direction: 'rtl',
                enterAnimationDuration: '100ms',
                exitAnimationDuration: '100ms',
                // OVERWRITE CONFIG
                ...config,
                // DATA
                data: { title: this.title, calendar: this.calendar, options: this.options },
            })
            .afterClosed()
            .subscribe({ next: (response?: R) => response && callback(response) });
    }

    bottomSheet(callback: (response: R) => void): void;
    bottomSheet(callback: (response: R) => void, config: MatBottomSheetConfig): void;
    bottomSheet(callback: (response: R) => void, arg1?: any): void {
        const config: MatBottomSheetConfig = arg1 || {};

        this.matBottomSheet
            .open<any, any, R>(BottomSheetComponent<R>, {
                // DEFAULT CONFIG
                direction: 'rtl',
                // OVERWRITE CONFIG
                ...config,
                // DATA
                data: { title: this.title, calendar: this.calendar, options: this.options },
            })
            .afterDismissed()
            .subscribe({ next: (response?: R) => response && callback(response) });
    }
}

@Injectable({ providedIn: 'root' })
export class NgxCalendarService {
    constructor(private readonly matBottomSheet: MatBottomSheet, private readonly matDialog: MatDialog) {}

    getDate(): NgxCalendarClass<INgxCalendarDate>;
    getDate(options: Partial<INgxCalendarOptions>): NgxCalendarClass<INgxCalendarDate>;
    getDate(arg1?: any): NgxCalendarClass<INgxCalendarDate> {
        const options: Partial<INgxCalendarOptions> = arg1 || {};

        return new NgxCalendarClass<INgxCalendarDate>('DATE', this.matBottomSheet, this.matDialog, options);
    }
}
