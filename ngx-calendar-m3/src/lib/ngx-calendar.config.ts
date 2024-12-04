import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders, Provider } from '@angular/core';

export interface INgxCalendarConfig {
    readonly mobileWidth: number;
    readonly timezone: string;
}

export const NGX_CALENDAR_CONFIG = new InjectionToken<Partial<INgxCalendarConfig>>('NGX-CALENDAR-CONFIG');

export const provideNgxCalendarConfig = (config: Partial<INgxCalendarConfig>): EnvironmentProviders => {
    const providers: Provider[] = [{ provide: NGX_CALENDAR_CONFIG, useValue: config }];

    return makeEnvironmentProviders(providers);
};
