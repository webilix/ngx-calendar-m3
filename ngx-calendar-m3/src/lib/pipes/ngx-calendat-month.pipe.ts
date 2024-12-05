import { Pipe, PipeTransform } from '@angular/core';

import { JalaliDateTime } from '@webilix/jalali-date-time';

@Pipe({ name: 'ngxCalendatMonth' })
export class NgxCalendatMonthPipe implements PipeTransform {
    transform(value?: Date | { from: Date; to: Date }, options?: { timezone?: string }): string {
        if (!value) return '';

        const jalali = JalaliDateTime();
        const timezone: string =
            options?.timezone && jalali.timezones().includes(options?.timezone) ? options?.timezone : 'Asia/Tehran';

        const date: Date = jalali.periodMonth(1, 'from' in value ? value.from : value, timezone).from;
        return jalali.toFullText(date, { format: 'N Y', timezone });
    }
}
