import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Optional, Output, SimpleChanges } from '@angular/core';
import { MatIconButton } from '@angular/material/button';

import { MatIcon } from '@angular/material/icon';

import { JalaliDateTime, JalaliDateTimeCalendar } from '@webilix/jalali-date-time';

import { INgxCalendarConfig, NGX_CALENDAR_CONFIG } from '../../ngx-calendar.config';
import { INgxCalendarDate } from '../../ngx-calendar.interface';

@Component({
    selector: 'ngx-calendar-date',
    imports: [MatIconButton, MatIcon],
    templateUrl: './ngx-calendar-date.component.html',
    styleUrl: './ngx-calendar-date.component.scss',
})
export class NgxCalendarDateComponent implements OnInit, OnChanges {
    @Input({ required: false }) value?: Date;
    @Input({ required: false }) minDate?: Date;
    @Input({ required: false }) maxDate?: Date;
    @Output() onChange: EventEmitter<INgxCalendarDate> = new EventEmitter<INgxCalendarDate>();

    public values!: { today: string; selected: string; minDate: string; maxDate: string };
    public calendar!: JalaliDateTimeCalendar;

    private jalali = JalaliDateTime();

    constructor(@Optional() @Inject(NGX_CALENDAR_CONFIG) public readonly config?: INgxCalendarConfig) {}

    ngOnInit(): void {
        this.initValues();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initValues();
    }

    initValues(): void {
        // Check MIN and MAX Dates
        if (this.minDate && this.maxDate && this.minDate.getTime() > this.maxDate.getTime()) {
            const date: Date = this.minDate;
            this.minDate = this.maxDate;
            this.maxDate = date;
        }

        // Check Value
        if (this.value && this.minDate && this.value.getTime() < this.minDate.getTime()) this.value = undefined;
        if (this.value && this.maxDate && this.value.getTime() > this.maxDate.getTime()) this.value = undefined;

        this.values = {
            today: this.jalali.toString(new Date(), { format: 'Y-M-D' }),
            selected: this.value ? this.jalali.toString(this.value, { format: 'Y-M-D' }) : '',
            minDate: this.minDate ? this.jalali.toString(this.minDate, { format: 'Y-M-D' }) : '0000-00-00',
            maxDate: this.maxDate ? this.jalali.toString(this.maxDate, { format: 'Y-M-D' }) : '9999-99-99',
        };

        const month: string = this.jalali.toString(this.value || new Date(), { format: 'Y-M' });
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
        const title: string = this.jalali.toFullText(date, { format: 'W، d N Y' });
        const jalali: string = this.jalali.toString(date, { format: 'Y-M-D' });

        this.values.selected = value;
        this.onChange.next({ date, title, jalali });
    }
}
