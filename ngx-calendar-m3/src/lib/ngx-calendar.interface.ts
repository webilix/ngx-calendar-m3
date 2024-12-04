export type NgxCalendar = 'DATE' | 'WEEK' | 'MONTH' | 'YEAR' | 'PERIOD';

export interface INgxCalendarOptions {
    readonly title: string;
    readonly value: Date;
    readonly minDate: Date;
    readonly maxDate: Date;
    readonly timezone: string;
}

export interface INgxCalendarDate {
    readonly timezone: string;
    readonly date: Date;
    readonly jalali: string;
}
