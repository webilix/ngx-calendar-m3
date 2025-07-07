import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { Helper } from '@webilix/helper-library';
import { JalaliDateTime } from '@webilix/jalali-date-time';

import { INgxCalendarDay } from './ngx-calendar-day.interface';

@Component({
    selector: 'ngx-calendar-day',
    imports: [MatIcon, MatIconButton],
    templateUrl: './ngx-calendar-day.component.html',
    styleUrl: './ngx-calendar-day.component.scss',
})
export class NgxCalendarDayComponent implements OnInit {
    @HostBinding('className') private className: string = 'ngx-calendar-m3';
    @HostBinding('style.--ngx-calendar-m3-width') cssWidth = '';
    @HostBinding('style.--ngx-calendar-m3-height') cssHeight = '';

    @Input({ required: false }) width?: string;
    @Input({ required: false }) height: string = '40px';
    @Input({ required: false }) route: string[] = [];
    @Output() onChanged: EventEmitter<INgxCalendarDay> = new EventEmitter<INgxCalendarDay>();

    public day: string = '';
    public title: string = '';

    public view?: 'MONTH' | 'DAY';
    public selected?: { month: number; title: string };

    public months: string[][] = [
        ['فروردین', 'اردیبهشت', 'خرداد'],
        ['تیر', 'مرداد', 'شهریور'],
        ['مهر', 'آبان', 'آذر'],
        ['دی', 'بهمن', 'اسفند'],
    ];

    public days: (number | null)[][] = [];

    private jalali = JalaliDateTime();

    constructor(private readonly activatedRoute: ActivatedRoute, private readonly router: Router) {}

    ngOnInit(): void {
        this.cssWidth = this.width || '100%';
        this.cssHeight = this.height;

        const isDay = (day: string): boolean => {
            if (!Helper.IS.string(day) || day.length !== 5) return false;
            if (!new RegExp('^[0-9]{2}-[0-9]{2}$').test(day)) return false;

            const [m, d] = day.split('-').map((v) => +v);
            if (m < 1 || m > 12) return false;
            if (d < 1 || d > 31) return false;
            if (m > 6 && d === 31) return false;

            return true;
        };

        const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };
        this.day =
            this.route.length > 0 && isDay(queryParams['ngx-calendar-day'])
                ? queryParams['ngx-calendar-day']
                : this.jalali.toString(new Date(), { format: 'M-D' });

        this.updateView();
    }

    updateView(): void {
        // Update Routes
        if (this.route.length !== 0) {
            const queryParams: { [key: string]: any } = { ...this.activatedRoute.snapshot.queryParams };

            queryParams['ngx-calendar-day'] = this.day;
            this.router.navigate(this.route, { queryParams });
        }

        const [month, day] = this.day.split('-').map((v) => +v);
        this.title = Helper.STRING.changeNumbers(`${day} ${this.months.flat()[month - 1]}`);

        this.onChanged.next({ day: this.day, title: this.title });
    }

    setPrevious(): void {
        let [month, day] = this.day.split('-').map((v) => +v);
        day--;

        if (day < 1) {
            month--;
            if (month < 1) month = 12;
            day = month < 7 ? 31 : 30;
        }

        this.day = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        this.updateView();
    }

    setNext(): void {
        let [month, day] = this.day.split('-').map((v) => +v);
        day++;

        if ((month < 7 && day > 31) || (month > 6 && day > 30)) {
            month++;
            if (month > 12) month = 1;
            day = 1;
        }

        this.day = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        this.updateView();
    }

    setMonth(month: number): void {
        if (this.view !== 'MONTH') return;
        if (month < 1 || month > 12) return;

        this.selected = { month, title: this.months.flat()[month - 1] };
        this.days = [
            [1, 2, 3, 4, 5, 6, 7],
            [8, 9, 10, 11, 12, 13, 14],
            [15, 16, 17, 18, 19, 20, 21],
            [22, 23, 24, 25, 26, 27, 28],
            [29, 30, this.selected.month < 7 ? 31 : null, null, null, null, null],
        ];

        this.view = 'DAY';
    }

    setDay(day: number | null): void {
        if (this.view !== 'DAY' || !day || !this.selected) return;
        if (day < 1 || day > 31) return;
        if (this.selected.month > 6 && day > 30) return;

        this.day = `${this.selected.month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        this.updateView();

        this.view = undefined;
    }
}
