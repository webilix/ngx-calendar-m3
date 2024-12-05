import { Pipe, PipeTransform } from '@angular/core';

import { Helper } from '@webilix/helper-library';
import { JalaliDateTime } from '@webilix/jalali-date-time';

@Pipe({ name: 'ngxCalendatDate' })
export class NgxCalendatDatePipe implements PipeTransform {
    transform(value?: Date, options?: { format?: string | 'FULL' | 'DATE' | 'TIME'; timezone?: string }): string {
        if (!value || !Helper.IS.date(value)) return '';

        const jalali = JalaliDateTime();
        const timezone: string =
            options?.timezone && jalali.timezones().includes(options?.timezone) ? options?.timezone : 'Asia/Tehran';

        const type: string | 'FULL' | 'DATE' | 'TIME' = options?.format || 'DATE';
        const format: string =
            type === 'FULL' ? 'W، d N Y H:I' : type === 'DATE' ? 'W، d N Y' : type === 'TIME' ? 'H:I' : type;

        return jalali.toFullText(value, { format, timezone });
    }
}
