import { Inject, Optional, Pipe, PipeTransform } from '@angular/core';

import { JalaliDateTime } from '@webilix/jalali-date-time';
import { Helper } from '@webilix/helper-library';

import { INgxCalendarConfig, NGX_CALENDAR_CONFIG } from '../ngx-calendar.config';

@Pipe({ name: 'ngxCalendatDate' })
export class NgxCalendatDatePipe implements PipeTransform {
    constructor(@Optional() @Inject(NGX_CALENDAR_CONFIG) public readonly config?: INgxCalendarConfig) {}

    transform(value?: Date, options?: { format?: string | 'FULL' | 'DATE' | 'TIME'; timezone?: string }): unknown {
        if (!value || !Helper.IS.date(value)) return '';

        const jalali = JalaliDateTime();
        const timezone: string = options?.timezone || this.config?.timezone || 'Asia/Tehran';

        const type: string | 'FULL' | 'DATE' | 'TIME' = options?.format || 'DATE';
        const format: string =
            type === 'FULL' ? 'W، d N Y H:I' : type === 'DATE' ? 'W، d N Y' : type === 'TIME' ? 'H:I' : type;

        return jalali.toFullText(value, {
            timezone: jalali.timezones().includes(timezone) ? timezone : 'Asia/Tehran',
            format,
        });
    }
}
