import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';
import { JalaliDateTime } from '@webilix/jalali-date-time';

@Pipe({ name: 'ngxCalendatWeek' })
export class NgxCalendatWeekPipe implements PipeTransform {
    transform(value?: Date | { from: Date; to: Date }, options?: { timezone?: string }): string {
        if (!value) return '';

        const jalali = JalaliDateTime();
        const timezone: string =
            options?.timezone && jalali.timezones().includes(options?.timezone) ? options?.timezone : 'Asia/Tehran';

        const { from, to } = jalali.periodWeek(1, 'from' in value ? value.from : value, timezone);
        return Helper.DATE.jalaliPeriod(from, to, timezone);
    }
}
