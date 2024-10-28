import {registerLocaleData} from '@angular/common';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {DEFAULT_CURRENCY_CODE, LOCALE_ID, importProvidersFrom, isDevMode, provideExperimentalZonelessChangeDetection} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {TitleStrategy, provideRouter, withPreloading} from '@angular/router';

import {provideTransloco} from '@jsverse/transloco';
import {MicroSentryModule} from '@micro-sentry/angular';
import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {biCacheInterceptor, provideBi, withCDN} from 'dfx-bootstrap-icons';
import {NgbPaginatorIntl} from 'dfx-bootstrap-table';
import {
  DfxPreloadStrategy,
  loggingInterceptor,
  postPutJsonContentTypeInterceptor,
  provideDfxHelper,
  withLoggingInterceptor,
  withMobileBreakpoint,
  withWindow,
} from 'dfx-helper';

import {NgbDateTimeAdapter} from '@home-shared/components/datetime-picker/datetime-adapter';

import {EnvironmentHelper} from '@shared/EnvironmentHelper';
import {CustomTitleStrategy} from '@shared/custom-title.strategy';
import {authInterceptor} from '@shared/services/auth/auth-interceptor';
import {CustomPaginatorIntl} from '@shared/services/custom-paginator-intl';
import {CustomDateParserFormatter, CustomDateTimeAdapter} from '@shared/services/datepicker-adapter';
import {errorInterceptor} from '@shared/services/error-interceptor';

import {AppComponent} from './app/app.component';
import {ROUTES} from './app/app.routes';
import {TranslocoHttpLoader} from './transloco-loader';

bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideDfxHelper(withMobileBreakpoint(1200), withLoggingInterceptor(['json', 'assets', 'auth']), withWindow()),
    provideAnimations(),
    DfxPreloadStrategy,
    provideRouter(ROUTES, withPreloading(DfxPreloadStrategy)),
    {provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR'},
    {
      provide: LOCALE_ID,
      useValue: 'de-AT',
    },
    {
      provide: TitleStrategy,
      useClass: CustomTitleStrategy,
    },
    {provide: NgbDateTimeAdapter, useClass: CustomDateTimeAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    {provide: NgbPaginatorIntl, useClass: CustomPaginatorIntl},
    provideHttpClient(
      withInterceptors([postPutJsonContentTypeInterceptor, loggingInterceptor, authInterceptor, errorInterceptor, biCacheInterceptor]),
    ),
    provideBi(withCDN('/assets/bootstrap-icons')),
    provideTransloco({
      config: {
        availableLangs: ['de'],
        defaultLang: 'de',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    importProvidersFrom(
      MicroSentryModule.forRoot({
        dsn: 'https://e1122a6efe6b4e51b6af528d10704449@glitchtip.kellner.team/1',
        environment: EnvironmentHelper.getType(),
      }),
    ),
  ],
}).catch((err: unknown) => {
  console.error(err);
});

registerLocaleData(localeDe, localeDeExtra);
