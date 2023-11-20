import {registerLocaleData} from '@angular/common';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {DEFAULT_CURRENCY_CODE, LOCALE_ID} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter, TitleStrategy, withPreloading} from '@angular/router';

import {NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import {provideBi, withIcons} from 'dfx-bootstrap-icons';
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
import {provideDfxTranslate, withAutoTranslatedLanguages, withDefaultLanguage} from 'dfx-translate';

import {CustomTitleStrategy} from './app/_shared/custom-title.strategy';
import {EnvironmentHelper} from './app/_shared/EnvironmentHelper';
import {authInterceptor} from './app/_shared/services/auth/auth-interceptor';
import {
  loginPwChangeUrl,
  loginUrl,
  refreshUrl,
  requestPasswordChangeUrl,
  sendPasswordChangeUrl,
} from './app/_shared/services/auth/auth.service';
import {errorInterceptor} from './app/_shared/services/auth/error-interceptor';
import {CustomDateParserFormatter, CustomDateTimeAdapter} from './app/_shared/services/datepicker-adapter';
import {NgbDateTimeAdapter} from './app/_shared/ui/datetime-picker/datetime-adapter';
import {ICONS} from './app/_shared/ui/icons';
import {AppComponent} from './app/app.component';
import {ROUTES} from './app/app.routes';
import {NgbPaginatorIntl} from './app/_shared/ui/paginator/paginator-intl.service';
import {CustomPaginatorIntl} from './app/_shared/services/custom-paginator-intl';

bootstrapApplication(AppComponent, {
  providers: [
    provideDfxHelper(
      withMobileBreakpoint(767),
      withBaseUrlInterceptor(EnvironmentHelper.getAPIUrl(), ['assets/i18n', 'assets/licenses.json']),
      withLoggingInterceptor(['json', loginUrl, loginPwChangeUrl, requestPasswordChangeUrl, sendPasswordChangeUrl, refreshUrl]),
      withWindow(),
    ),
    provideDfxTranslate(withDefaultLanguage('de'), withAutoTranslatedLanguages(['en', 'es', 'fr', 'it', 'pt'])),
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
      withInterceptors([baseUrlInterceptor, postPutJsonContentTypeInterceptor, loggingInterceptor, authInterceptor, errorInterceptor]),
    ),
    provideBi(withIcons(ICONS)),
  ],
}).catch((err) => console.error(err));

registerLocaleData(localeDe, localeDeExtra);
