import { Injectable } from '@angular/core';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';

import { BottomSheetComponent, DialogComponent, IContainer } from './service';
import {
    INgxCalendarDate,
    INgxCalendarMonth,
    INgxCalendarWeek,
    INgxCalendarYear,
    NgxCalendar,
} from './ngx-calendar.interface';

interface ICalendar {
    readonly title: string;
    readonly value: Date;
    readonly minDate: Date;
    readonly maxDate: Date;
}

interface ICalendarDate extends ICalendar {}
interface ICalendarWeek extends Omit<ICalendar, 'value'> {
    readonly value: Date | { readonly from: Date; readonly to: Date };
}
interface ICalendarMonth extends Omit<ICalendar, 'value'> {
    readonly value: Date | { readonly from: Date; readonly to: Date };
}
interface ICalendarYear extends Omit<ICalendar, 'value'> {
    readonly value: Date | { readonly from: Date; readonly to: Date };
}

class NgxCalendarClass<R /* RESPONSE */> {
    constructor(
        private readonly calendar: NgxCalendar,
        private readonly matBottomSheet: MatBottomSheet,
        private readonly matDialog: MatDialog,
        private readonly container: IContainer,
    ) {}

    dialog(callback: (response: R) => void): void {
        this.matDialog
            .open<any, any, R>(DialogComponent, {
                // DEFAULT CONFIG
                direction: 'rtl',
                enterAnimationDuration: '100ms',
                exitAnimationDuration: '100ms',
                // DATA
                data: { calendar: this.calendar, container: this.container },
            })
            .afterClosed()
            .subscribe({ next: (response?: R) => response && callback(response) });
    }

    bottomSheet(callback: (response: R) => void): void {
        this.matBottomSheet
            .open<any, any, R>(BottomSheetComponent<R>, {
                // DEFAULT CONFIG
                direction: 'rtl',
                panelClass: 'ngx-calendar-bottom-sheet',
                // DATA
                data: { calendar: this.calendar, container: this.container },
            })
            .afterDismissed()
            .subscribe({ next: (response?: R) => response && callback(response) });
    }
}

@Injectable({ providedIn: 'root' })
export class NgxCalendarService {
    constructor(private readonly matBottomSheet: MatBottomSheet, private readonly matDialog: MatDialog) {}

    private getTitle(calendar: NgxCalendar, title?: string): string {
        if (title) return title;

        switch (calendar) {
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

    getDate(): NgxCalendarClass<INgxCalendarDate>;
    getDate(options: Partial<ICalendarDate>): NgxCalendarClass<INgxCalendarDate>;
    getDate(arg1?: any): NgxCalendarClass<INgxCalendarDate> {
        const options: Partial<ICalendarDate> = arg1 || {};
        const container: IContainer = {
            title: this.getTitle('DATE', options.title),
            value: options.value ? { from: options.value, to: options.value } : undefined,
            minDate: options.minDate,
            maxDate: options.maxDate,
        };

        return new NgxCalendarClass<INgxCalendarDate>('DATE', this.matBottomSheet, this.matDialog, container);
    }

    getWeek(): NgxCalendarClass<INgxCalendarWeek>;
    getWeek(options: Partial<ICalendarWeek>): NgxCalendarClass<INgxCalendarWeek>;
    getWeek(arg1?: any): NgxCalendarClass<INgxCalendarWeek> {
        const options: Partial<ICalendarWeek> = arg1 || {};
        const container: IContainer = {
            title: this.getTitle('WEEK', options.title),
            value: options.value
                ? 'from' in options.value
                    ? options.value
                    : { from: options.value, to: options.value }
                : undefined,
            minDate: options.minDate,
            maxDate: options.maxDate,
        };

        return new NgxCalendarClass<INgxCalendarWeek>('WEEK', this.matBottomSheet, this.matDialog, container);
    }

    getMonth(): NgxCalendarClass<INgxCalendarMonth>;
    getMonth(options: Partial<ICalendarMonth>): NgxCalendarClass<INgxCalendarMonth>;
    getMonth(arg1?: any): NgxCalendarClass<INgxCalendarMonth> {
        const options: Partial<ICalendarMonth> = arg1 || {};
        const container: IContainer = {
            title: this.getTitle('MONTH', options.title),
            value: options.value
                ? 'from' in options.value
                    ? options.value
                    : { from: options.value, to: options.value }
                : undefined,
            minDate: options.minDate,
            maxDate: options.maxDate,
        };

        return new NgxCalendarClass<INgxCalendarMonth>('MONTH', this.matBottomSheet, this.matDialog, container);
    }

    getYear(): NgxCalendarClass<INgxCalendarYear>;
    getYear(options: Partial<ICalendarYear>): NgxCalendarClass<INgxCalendarYear>;
    getYear(arg1?: any): NgxCalendarClass<INgxCalendarYear> {
        const options: Partial<ICalendarYear> = arg1 || {};
        const container: IContainer = {
            title: this.getTitle('YEAR', options.title),
            value: options.value
                ? 'from' in options.value
                    ? options.value
                    : { from: options.value, to: options.value }
                : undefined,
            minDate: options.minDate,
            maxDate: options.maxDate,
        };

        return new NgxCalendarClass<INgxCalendarYear>('YEAR', this.matBottomSheet, this.matDialog, container);
    }
}
