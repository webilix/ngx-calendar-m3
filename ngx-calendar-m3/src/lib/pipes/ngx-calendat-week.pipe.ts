import { Inject, Optional, Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';
import { JalaliDateTime } from '@webilix/jalali-date-time';

import { INgxCalendarConfig, NGX_CALENDAR_CONFIG } from '../ngx-calendar.config';

@Pipe({ name: 'ngxCalendatWeek' })
export class NgxCalendatWeekPipe implements PipeTransform {
    constructor(@Optional() @Inject(NGX_CALENDAR_CONFIG) public readonly config?: INgxCalendarConfig) {}

    transform(value?: Date | { from: Date; to: Date }, options?: { timezone?: string }): string {
        if (!value) return '';

        const jalali = JalaliDateTime();
        let timezone: string = options?.timezone || this.config?.timezone || 'Asia/Tehran';
        timezone = jalali.timezones().includes(timezone) ? timezone : 'Asia/Tehran';

        const { from, to } = jalali.periodWeek(1, 'from' in value ? value.from : value, timezone);
        return Helper.DATE.jalaliPeriod(from, to, timezone);
    }
}
