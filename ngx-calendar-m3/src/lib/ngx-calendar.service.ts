import { Injectable } from '@angular/core';

import { NgxHelperContainerService } from '@webilix/ngx-helper-m3';

import { DialogComponent, IContainer } from './container';
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
        private readonly container: IContainer,
        private readonly ngxHelperContainerService: NgxHelperContainerService,
        private readonly title?: string,
    ) {}

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

    dialog(onResponse: (response: R) => void): void;
    dialog(onResponse: (response: R) => void, onDismiss: () => void): void;
    dialog(onResponse: (response: R) => void, onDismiss?: () => void): void {
        this.ngxHelperContainerService
            .init(DialogComponent, this.getTitle(this.calendar, this.title), {
                data: { calendar: this.calendar, container: this.container },
                padding: '0',
            })
            .dialog<R>(onResponse, onDismiss || (() => {}));
    }

    bottomSheet(onResponse: (response: R) => void): void;
    bottomSheet(onResponse: (response: R) => void, onDismiss: () => void): void;
    bottomSheet(onResponse: (response: R) => void, onDismiss?: () => void): void {
        this.ngxHelperContainerService
            .init(DialogComponent, this.getTitle(this.calendar, this.title), {
                data: { calendar: this.calendar, container: this.container },
                padding: '0',
            })
            .bottomSheet<R>(onResponse, onDismiss || (() => {}));
    }
}

@Injectable({ providedIn: 'root' })
export class NgxCalendarService {
    constructor(private readonly ngxHelperContainerService: NgxHelperContainerService) {}

    getDate(): NgxCalendarClass<INgxCalendarDate>;
    getDate(options: Partial<ICalendarDate>): NgxCalendarClass<INgxCalendarDate>;
    getDate(arg1?: any): NgxCalendarClass<INgxCalendarDate> {
        const options: Partial<ICalendarDate> = arg1 || {};
        const container: IContainer = {
            value: options.value ? { from: options.value, to: options.value } : undefined,
            minDate: options.minDate,
            maxDate: options.maxDate,
        };

        return new NgxCalendarClass<INgxCalendarDate>('DATE', container, this.ngxHelperContainerService, options.title);
    }

    getWeek(): NgxCalendarClass<INgxCalendarWeek>;
    getWeek(options: Partial<ICalendarWeek>): NgxCalendarClass<INgxCalendarWeek>;
    getWeek(arg1?: any): NgxCalendarClass<INgxCalendarWeek> {
        const options: Partial<ICalendarWeek> = arg1 || {};
        const container: IContainer = {
            value: options.value
                ? 'from' in options.value
                    ? options.value
                    : { from: options.value, to: options.value }
                : undefined,
            minDate: options.minDate,
            maxDate: options.maxDate,
        };

        return new NgxCalendarClass<INgxCalendarWeek>('WEEK', container, this.ngxHelperContainerService, options.title);
    }

    getMonth(): NgxCalendarClass<INgxCalendarMonth>;
    getMonth(options: Partial<ICalendarMonth>): NgxCalendarClass<INgxCalendarMonth>;
    getMonth(arg1?: any): NgxCalendarClass<INgxCalendarMonth> {
        const options: Partial<ICalendarMonth> = arg1 || {};
        const container: IContainer = {
            value: options.value
                ? 'from' in options.value
                    ? options.value
                    : { from: options.value, to: options.value }
                : undefined,
            minDate: options.minDate,
            maxDate: options.maxDate,
        };

        return new NgxCalendarClass<INgxCalendarMonth>('MONTH', container, this.ngxHelperContainerService, options.title);
    }

    getYear(): NgxCalendarClass<INgxCalendarYear>;
    getYear(options: Partial<ICalendarYear>): NgxCalendarClass<INgxCalendarYear>;
    getYear(arg1?: any): NgxCalendarClass<INgxCalendarYear> {
        const options: Partial<ICalendarYear> = arg1 || {};
        const container: IContainer = {
            value: options.value
                ? 'from' in options.value
                    ? options.value
                    : { from: options.value, to: options.value }
                : undefined,
            minDate: options.minDate,
            maxDate: options.maxDate,
        };

        return new NgxCalendarClass<INgxCalendarYear>('YEAR', container, this.ngxHelperContainerService, options.title);
    }
}
