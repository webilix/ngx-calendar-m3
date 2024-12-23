import { Component, EventEmitter, HostBinding, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { JalaliDateTime } from '@webilix/jalali-date-time';

import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { INgxCalendarDate, INgxCalendarDateTime } from '../../ngx-calendar.interface';

import { NgxCalendarDateComponent } from '../date/ngx-calendar-date.component';

@Component({
    selector: 'ngx-calendar-date-time',
    imports: [MatButton, MatIcon, MatMenuModule, NgxCalendarDateComponent],
    templateUrl: './ngx-calendar-date-time.component.html',
    styleUrl: './ngx-calendar-date-time.component.scss',
})
export class NgxCalendarDateTimeComponent implements OnInit, OnChanges {
    @HostBinding('className') private className: string = 'ngx-calendar-m3-date-time';

    @Input({ required: false }) value?: Date;
    @Input({ required: false }) minDate?: Date;
    @Input({ required: false }) maxDate?: Date;
    @Output() onChange: EventEmitter<INgxCalendarDateTime> = new EventEmitter<INgxCalendarDateTime>();

    public canSubmit: boolean = false;
    public dateString!: string;

    public hour!: string;
    public hours: string[] = [...Array(24).keys()].map((hour: number) => hour.toString().padStart(2, '0'));

    public minute!: string;
    public minutes: string[] = [...Array(60).keys()].map((minute: number) => minute.toString().padStart(2, '0'));

    private jalali = JalaliDateTime();

    ngOnInit(): void {
        this.initValues();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.initValues();
    }

    formatDate(date: Date): string {
        return this.jalali.toString(date, { format: 'Y-M-D H:I' });
    }

    initValues(): void {
        const updateDate = (date: Date): void => {
            date.setSeconds(0);
            date.setMilliseconds(0);
        };

        if (this.value) updateDate(this.value);
        if (this.minDate) updateDate(this.minDate);
        if (this.maxDate) updateDate(this.maxDate);

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

        this.hour = (this.value || new Date()).getHours().toString().padStart(2, '0');
        this.minute = (this.value || new Date()).getMinutes().toString().padStart(2, '0');
        this.updateValue();
    }

    updateValue(): void {
        this.canSubmit = false;
        if (!this.value) return;

        this.value.setHours(+this.hour);
        this.value.setMinutes(+this.minute);
        this.value.setSeconds(0);
        this.value.setMilliseconds(0);

        if (this.minDate && this.formatDate(this.value) < this.formatDate(this.minDate)) {
            this.value.setHours(this.minDate.getHours());
            this.value.setMinutes(this.minDate.getMinutes());
        }

        if (this.maxDate && this.formatDate(this.value) > this.formatDate(this.maxDate)) {
            this.value.setHours(this.maxDate.getHours());
            this.value.setMinutes(this.maxDate.getMinutes());
        }

        this.hour = this.value.getHours().toString().padStart(2, '0');
        this.minute = this.value.getMinutes().toString().padStart(2, '0');
        this.canSubmit = true;
    }

    setDate(date: INgxCalendarDate): void {
        this.value = date.date;
        this.updateValue();
    }

    checkHour(hour: string): boolean {
        if (!this.value) return false;
        if (!this.minDate && !this.maxDate) return true;

        const check: string = this.jalali.toString(this.value, { format: `Y-M-D ${hour}` });
        if (this.minDate && check < this.formatDate(this.minDate).substring(0, 13)) return false;
        if (this.maxDate && check > this.formatDate(this.maxDate).substring(0, 13)) return false;
        return true;
    }

    setHour(hour: string) {
        this.hour = hour;
        this.updateValue();
    }

    checkMinute(minute: string): boolean {
        if (!this.value) return false;
        if (!this.minDate && !this.maxDate) return true;

        const check: string = this.jalali.toString(this.value, { format: `Y-M-D H:${minute}` });
        if (this.minDate && check < this.formatDate(this.minDate)) return false;
        if (this.maxDate && check > this.formatDate(this.maxDate)) return false;
        return true;
    }

    setMinute(minute: string) {
        this.minute = minute;
        this.updateValue();
    }

    onSubmit(): void {
        if (!this.value || !this.canSubmit) return;

        const date: Date = new Date(this.value.getTime());
        const title: string = this.jalali.toFullText(date, { format: 'W، d N Y' });
        const jalali: string = this.formatDate(date);
        this.onChange.next({ date, title, jalali });
    }
}
