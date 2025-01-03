import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { JalaliDateTime } from '@webilix/jalali-date-time';

import { INgxCalendarYear } from '../../ngx-calendar.interface';

@Component({
    selector: 'ngx-calendar-year',
    imports: [MatIconButton, MatIcon],
    templateUrl: './ngx-calendar-year.component.html',
    styleUrl: './ngx-calendar-year.component.scss',
})
export class NgxCalendarYearComponent implements OnInit, OnChanges {
    @HostBinding('className') private className: string = 'ngx-calendar-m3-year';

    @Input({ required: false }) value?: Date | { from: Date; to: Date };
    @Input({ required: false }) minDate?: 'NOW' | Date;
    @Input({ required: false }) maxDate?: 'NOW' | Date;
    @Output() onChange: EventEmitter<INgxCalendarYear> = new EventEmitter<INgxCalendarYear>();

    public values!: { today: string; selected: string; minDate: string; maxDate: string };
    public years!: number[];

    private jalali = JalaliDateTime();

    ngOnInit(): void {
        this.initValues();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initValues();
    }

    initValues(): void {
        const getYear = (date: Date): string => this.jalali.toString(date, { format: 'Y' });
        let minDate: Date | undefined = this.minDate === 'NOW' ? new Date() : this.minDate;
        let maxDate: Date | undefined = this.maxDate === 'NOW' ? new Date() : this.maxDate;

        // Check MIN and MAX Dates
        if (minDate && maxDate && minDate.getTime() > maxDate.getTime()) {
            const date: Date = new Date(minDate);
            minDate = maxDate;
            maxDate = date;
        }

        // Check Value
        let value: Date | undefined = this.value ? ('from' in this.value ? this.value.from : this.value) : undefined;
        if (value && minDate && getYear(value) < getYear(minDate)) value = undefined;
        if (value && maxDate && getYear(value) > getYear(maxDate)) value = undefined;

        this.values = {
            today: getYear(new Date()),
            selected: value ? getYear(value) : '',
            minDate: minDate ? getYear(minDate) : '0000',
            maxDate: maxDate ? getYear(maxDate) : '9999',
        };

        const year: string = this.values.selected ? this.values.selected : this.values.today;
        this.changeYear(+year.substring(0, 4));
    }

    changeYear(year: number): void {
        if (year < 1000) year = 1000;

        const count: number = 25;
        const start: number = year - (year % count);
        this.years = [...Array(count).keys()].map((n: number) => start + n);
    }

    setYear(value: string): void {
        if (
            value < '1000' ||
            (this.values.minDate && value < this.values.minDate) ||
            (this.values.maxDate && value > this.values.maxDate)
        )
            return;

        const lastDayInYear: string = this.jalali.daysInMonth(`${value}-12`).toString();
        const from: Date = new Date(this.jalali.gregorian(`${value}-01-01`).date + 'T00:00:00.000Z');
        const to: Date = new Date(this.jalali.gregorian(`${value}-12-${lastDayInYear}`).date + 'T00:00:00.000Z');
        const period = {
            from: this.jalali.periodDay(1, from).from,
            to: this.jalali.periodDay(1, to).to,
        };

        this.values.selected = value;
        this.onChange.next({ period, year: +value });
    }
}
