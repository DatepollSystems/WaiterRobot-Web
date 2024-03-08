import {registerLocaleData} from '@angular/common';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {DEFAULT_CURRENCY_CODE, importProvidersFrom, isDevMode, LOCALE_ID} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter, TitleStrategy, withPreloading} from '@angular/router';
import {NgbDateTimeAdapter} from '@home-shared/components/datetime-picker/datetime-adapter';
import {MicroSentryModule} from '@micro-sentry/angular';

import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {provideTransloco} from '@ngneat/transloco';

import {CustomTitleStrategy} from '@shared/custom-title.strategy';
import {EnvironmentHelper} from '@shared/EnvironmentHelper';
import {authInterceptor} from '@shared/services/auth/auth-interceptor';
import {loginPwChangeUrl, loginUrl, refreshUrl, requestPasswordChangeUrl, sendPasswordChangeUrl} from '@shared/services/auth/auth.service';
import {CustomPaginatorIntl} from '@shared/services/custom-paginator-intl';
import {CustomDateParserFormatter, CustomDateTimeAdapter} from '@shared/services/datepicker-adapter';
import {errorInterceptor} from '@shared/services/error-interceptor';

import {biCacheInterceptor, provideBi, withCDN} from 'dfx-bootstrap-icons';
import {NgbPaginatorIntl} from 'dfx-bootstrap-table';
import {
  baseUrlInterceptor,
  DfxPreloadStrategy,
  loggingInterceptor,
  postPutJsonContentTypeInterceptor,
  provideDfxHelper,
  withBaseUrlInterceptor,
  withLoggingInterceptor,
  withMobileBreakpoint,
  withWindow,
} from 'dfx-helper';
import {AppComponent} from './app/app.component';
import {ROUTES} from './app/app.routes';
import {TranslocoHttpLoader} from './transloco-loader';

bootstrapApplication(AppComponent, {
  providers: [
    provideDfxHelper(
      withMobileBreakpoint(767),
      withBaseUrlInterceptor(EnvironmentHelper.getAPIUrl(), ['assets/i18n', 'assets/licenses.json', 'share.dafnik.me']),
      withLoggingInterceptor([
        'json',
        loginUrl,
        loginPwChangeUrl,
        requestPasswordChangeUrl,
        sendPasswordChangeUrl,
        refreshUrl,
        'share.dafnik.me',
      ]),
      withWindow(),
    ),
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
      withInterceptors([
        baseUrlInterceptor,
        postPutJsonContentTypeInterceptor,
        loggingInterceptor,
        authInterceptor,
        errorInterceptor,
        biCacheInterceptor,
      ]),
    ),
    provideBi(withCDN('https://share.dafnik.me/dfx-bootstrap-icons')),
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
}).catch((err) => {
  console.error(err);
});

registerLocaleData(localeDe, localeDeExtra);
