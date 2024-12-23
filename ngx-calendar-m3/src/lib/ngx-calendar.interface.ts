export type NgxCalendar = 'DATE' | 'WEEK' | 'MONTH' | 'YEAR' | 'PERIOD';

export interface INgxCalendar {
    readonly calendar: NgxCalendar;
    readonly period: { readonly from: Date; readonly to: Date };
    readonly title: string;
}

export interface INgxCalendarDate {
    readonly date: Date;
    readonly title: string;
    readonly jalali: string;
}

export interface INgxCalendarDateTime {
    readonly date: Date;
    readonly title: string;
    readonly jalali: string;
}

export interface INgxCalendarWeek {
    readonly period: { readonly from: Date; readonly to: Date };
    readonly title: string;
}

export interface INgxCalendarMonth {
    readonly period: { readonly from: Date; readonly to: Date };
    readonly title: string;
    readonly jalali: string;
}

export interface INgxCalendarYear {
    readonly period: { readonly from: Date; readonly to: Date };
    readonly year: number;
}
