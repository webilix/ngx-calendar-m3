import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { provideNgxCalendarConfig } from '@webilix/ngx-calendar-m3';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideAnimationsAsync(),

        // NGX-CALENDAR CONFIG
        provideNgxCalendarConfig({ mobileWidth: 900 }),
    ],
};
