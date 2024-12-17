import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { Helper } from '@webilix/helper-library';
import { JalaliDateTime, JalaliDateTimeCalendar, JalaliDateTimePeriod } from '@webilix/jalali-date-time';

import { INgxCalendarWeek } from '../../ngx-calendar.interface';

@Component({
    selector: 'ngx-calendar-week',
    imports: [MatIconButton, MatIcon],
    templateUrl: './ngx-calendar-week.component.html',
    styleUrl: './ngx-calendar-week.component.scss',
    animations: [
        trigger('month', [
            transition(':enter', [style({ height: '*', opacity: 0 }), animate('150ms', style({ height: '*', opacity: 1 }))]),
        ]),
    ],
})
export class NgxCalendarWeekComponent implements OnInit, OnChanges {
    @HostBinding('className') private className: string = 'ngx-calendar-m3-week';

    @Input({ required: false }) value?: Date | { from: Date; to: Date };
    @Input({ required: false }) minDate?: Date;
    @Input({ required: false }) maxDate?: Date;
    @Output() onChange: EventEmitter<INgxCalendarWeek> = new EventEmitter<INgxCalendarWeek>();

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
        const getWeek = (date: Date, period: 'from' | 'to'): string => {
            const week: JalaliDateTimePeriod = this.jalali.periodWeek(1, date);
            return this.formatDate(period === 'from' ? week.from : week.to);
        };

        // Check MIN and MAX Dates
        if (this.minDate && this.maxDate && this.minDate.getTime() > this.maxDate.getTime()) {
            const date: Date = this.minDate;
            this.minDate = this.maxDate;
            this.maxDate = date;
        }

        // Check Value
        let value: Date | undefined = this.value ? ('from' in this.value ? this.value.from : this.value) : undefined;
        if (value && this.minDate && this.formatDate(value) < getWeek(this.minDate, 'from')) value = undefined;
        if (value && this.maxDate && this.formatDate(value) > getWeek(this.maxDate, 'to')) value = undefined;

        this.values = {
            today: this.formatDate(new Date()),
            selected: value ? getWeek(value, 'from') : '',
            minDate: this.minDate ? getWeek(this.minDate, 'from') : '0000-00-00',
            maxDate: this.maxDate ? getWeek(this.maxDate, 'to') : '9999-99-99',
        };

        const month: string = this.jalali.toString(value || new Date(), { format: 'Y-M' });
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
        const period: JalaliDateTimePeriod = this.jalali.periodWeek(1, date);
        const title: string = Helper.DATE.jalaliPeriod(period.from, period.to);

        this.values.selected = this.formatDate(period.from);
        this.onChange.next({ period, title });
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
