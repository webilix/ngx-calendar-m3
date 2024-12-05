import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { JalaliDateTime, JalaliDateTimeCalendar } from '@webilix/jalali-date-time';

import { INgxCalendarDate } from '../../ngx-calendar.interface';

@Component({
    selector: 'ngx-calendar-date',
    imports: [MatIconButton, MatIcon],
    templateUrl: './ngx-calendar-date.component.html',
    styleUrl: './ngx-calendar-date.component.scss',
    animations: [
        trigger('month', [
            transition(':enter', [style({ height: '*', opacity: 0 }), animate('150ms', style({ height: '*', opacity: 1 }))]),
        ]),
    ],
})
export class NgxCalendarDateComponent implements OnInit, OnChanges {
    @Input({ required: false }) value?: Date;
    @Input({ required: false }) minDate?: Date;
    @Input({ required: false }) maxDate?: Date;
    @Output() onChange: EventEmitter<INgxCalendarDate> = new EventEmitter<INgxCalendarDate>();

    public view: 'CALENDAR' | 'MONTH' = 'CALENDAR';
    public values!: { today: string; selected: string; minDate: string; maxDate: string };
    public calendar!: JalaliDateTimeCalendar;

    public year!: number;
    public years: number[] = [];
    public seasons: { title: string; month: string }[][] = [
        [
            { title: 'فروردین', month: '' },
            { title: 'اردیبهشت', month: '' },
            { title: 'خرداد', month: '' },
        ],
        [
            { title: 'تیر', month: '' },
            { title: 'مرداد', month: '' },
            { title: 'شهریور', month: '' },
        ],
        [
            { title: 'مهر', month: '' },
            { title: 'آبان', month: '' },
            { title: 'آذر', month: '' },
        ],
        [
            { title: 'دی', month: '' },
            { title: 'بهمن', month: '' },
            { title: 'اسفند', month: '' },
        ],
    ];

    private jalali = JalaliDateTime();

    ngOnInit(): void {
        this.initValues();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initValues();
    }

    formatDate(date: Date): string {
        return this.jalali.toString(date, { format: 'Y-M-D' });
    }

    initValues(): void {
        // Check MIN and MAX Dates
        if (this.minDate && this.maxDate && this.minDate.getTime() > this.maxDate.getTime()) {
            const date: Date = this.minDate;
            this.minDate = this.maxDate;
            this.maxDate = date;
        }

        // Check Value
        if (this.value && this.minDate && this.formatDate(this.value) < this.formatDate(this.minDate))
            this.value = undefined;
        if (this.value && this.maxDate && this.formatDate(this.value) > this.formatDate(this.maxDate))
            this.value = undefined;

        this.values = {
            today: this.formatDate(new Date()),
            selected: this.value ? this.formatDate(this.value) : '',
            minDate: this.minDate ? this.formatDate(this.minDate) : '0000-00-00',
            maxDate: this.maxDate ? this.formatDate(this.maxDate) : '9999-99-99',
        };

        const month: string = this.jalali.toString(this.value || new Date(), { format: 'Y-M' });
        this.calendar = this.jalali.calendar(month);
        this.view = 'CALENDAR';
    }

    changeMonth(change: number): void {
        let [year, month] = this.calendar.month.split('-').map((v: string) => +v);
        switch (change) {
            case 12:
            case -12:
                year += change === 12 ? 1 : -1;
                break;

            case 1:
            case -1:
                month += change;
                if (month === 13) {
                    year++;
                    month = 1;
                }
                if (month === 0) {
                    year--;
                    month = 12;
                }
                break;

            case 0:
                [year, month] = this.values.today.split('-').map((v: string) => +v);
                break;
        }

        this.calendar = this.jalali.calendar(year.toString() + '-' + month.toString().padStart(2, '0'));
    }

    setDate(value: string): void {
        const gregorian: string = this.jalali.gregorian(value).date;
        const date: Date = this.jalali.periodDay(1, new Date(gregorian + 'T00:00:00.000Z')).from;
        const title: string = this.jalali.toFullText(date, { format: 'W، d N Y' });
        const jalali: string = this.formatDate(date);

        this.values.selected = value;
        this.onChange.next({ date, title, jalali });
    }

    toggleView(): void {
        this.view = this.view === 'CALENDAR' ? 'MONTH' : 'CALENDAR';
        if (this.view === 'MONTH') this.changeYear(+this.calendar.month.substring(0, 4));
    }

    changeYear(year?: number): void {
        if (year && year < 1000) return;
        this.year = year || +this.values.today.substring(0, 4);

        let decade: number = this.year - (this.year % 10);
        if (decade <= 1020) decade = 1020;
        this.years = [decade - 20, decade - 10, decade, decade + 10, decade + 20];
        this.seasons.forEach((season, s: number) => {
            season.forEach((month, m: number) => {
                month.month = `${this.year.toString()}-${(s * 3 + m + 1).toString().padStart(2, '0')}`;
            });
        });
    }

    setMonth(month: string): void {
        this.calendar = this.jalali.calendar(month);
        this.view = 'CALENDAR';
    }
}
