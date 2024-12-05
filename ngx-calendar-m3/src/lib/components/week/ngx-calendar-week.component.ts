import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

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
})
export class NgxCalendarWeekComponent implements OnInit, OnChanges {
    @Input({ required: false }) value?: Date | { from: Date; to: Date };
    @Input({ required: false }) minDate?: Date;
    @Input({ required: false }) maxDate?: Date;
    @Output() onChange: EventEmitter<INgxCalendarWeek> = new EventEmitter<INgxCalendarWeek>();

    public values!: { today: string; selected: string; minDate: string; maxDate: string };
    public calendar!: JalaliDateTimeCalendar;

    private jalali = JalaliDateTime();

    ngOnInit(): void {
        this.initValues();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initValues();
    }

    initValues(): void {
        const getSaturday = (date: Date, period: 'from' | 'to'): string => {
            const week: JalaliDateTimePeriod = this.jalali.periodWeek(1, date);
            return this.jalali.toString(period === 'from' ? week.from : week.to, { format: 'Y-M-D' });
        };

        // Check MIN and MAX Dates
        if (this.minDate && this.maxDate && this.minDate.getTime() > this.maxDate.getTime()) {
            const date: Date = this.minDate;
            this.minDate = this.maxDate;
            this.maxDate = date;
        }

        // Check Value
        let value: Date | undefined = this.value ? ('from' in this.value ? this.value.from : this.value) : undefined;
        if (value && this.minDate && value.getTime() < this.minDate.getTime()) this.value = undefined;
        if (value && this.maxDate && value.getTime() > this.maxDate.getTime()) this.value = undefined;

        this.values = {
            today: this.jalali.toString(new Date(), { format: 'Y-M-D' }),
            selected: value ? getSaturday(value, 'from') : '',
            minDate: this.minDate ? getSaturday(this.minDate, 'from') : '0000-00-00',
            maxDate: this.maxDate ? getSaturday(this.maxDate, 'to') : '9999-99-99',
        };

        const month: string = this.jalali.toString(value || new Date(), { format: 'Y-M' });
        this.calendar = this.jalali.calendar(month);
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

        this.values.selected = this.jalali.toString(period.from, { format: 'Y-M-D' });
        this.onChange.next({ period, title });
    }
}
