export type NgxCalendar = 'DATE' | 'WEEK' | 'MONTH' | 'YEAR' | 'PERIOD';

export interface INgxCalendarDate {
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
