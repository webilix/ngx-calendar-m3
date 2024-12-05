import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { JalaliDateTime, JalaliDateTimePeriod } from '@webilix/jalali-date-time';

import { INgxCalendarMonth } from '../../ngx-calendar.interface';

@Component({
    selector: 'ngx-calendar-month',
    imports: [MatIconButton, MatIcon],
    templateUrl: './ngx-calendar-month.component.html',
    styleUrl: './ngx-calendar-month.component.scss',
})
export class NgxCalendarMonthComponent implements OnInit, OnChanges {
    @Input({ required: false }) value?: Date | { from: Date; to: Date };
    @Input({ required: false }) minDate?: Date;
    @Input({ required: false }) maxDate?: Date;
    @Output() onChange: EventEmitter<INgxCalendarMonth> = new EventEmitter<INgxCalendarMonth>();

    public values!: { today: string; selected: string; minDate: string; maxDate: string };
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

    initValues(): void {
        const getMonth = (date: Date): string => this.jalali.toString(date, { format: 'Y-M' });

        // Check MIN and MAX Dates
        if (this.minDate && this.maxDate && this.minDate.getTime() > this.maxDate.getTime()) {
            const date: Date = this.minDate;
            this.minDate = this.maxDate;
            this.maxDate = date;
        }

        // Check Value
        let value: Date | undefined = this.value ? ('from' in this.value ? this.value.from : this.value) : undefined;
        if (value && this.minDate && getMonth(value) < getMonth(this.minDate)) value = undefined;
        if (value && this.maxDate && getMonth(value) > getMonth(this.maxDate)) value = undefined;

        this.values = {
            today: getMonth(new Date()),
            selected: value ? getMonth(value) : '',
            minDate: this.minDate ? getMonth(this.minDate) : '0000-00',
            maxDate: this.maxDate ? getMonth(this.maxDate) : '9999-99',
        };

        const year: string = this.values.selected ? this.values.selected : this.values.today;
        this.changeYear(+year.substring(0, 4));
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

    setMonth(value: string): void {
        const gregorian: string = this.jalali.gregorian(`${value}-01`).date;
        const date: Date = this.jalali.periodDay(1, new Date(gregorian + 'T00:00:00.000Z')).from;
        const period: JalaliDateTimePeriod = this.jalali.periodMonth(1, date);
        const title: string = this.jalali.toFullText(period.from, { format: 'N Y' });

        this.values.selected = value;
        this.onChange.next({ period, title, jalali: value });
    }
}
