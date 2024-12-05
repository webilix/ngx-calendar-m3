export type NgxCalendar = 'DATE' | 'WEEK' | 'MONTH' | 'YEAR' | 'PERIOD';

export interface INgxCalendarOptions {
    readonly title: string;
    readonly value: Date;
    readonly minDate: Date;
    readonly maxDate: Date;
}

export interface INgxCalendarDate {
    readonly date: Date;
    readonly jalali: string;
}

export interface INgxCalendarWeek {
    readonly period: { from: Date; to: Date };
    readonly title: string;
}
