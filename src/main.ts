import {registerLocaleData} from '@angular/common';

import {provideHttpClient, withInterceptors} from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {LOCALE_ID} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter, TitleStrategy, withPreloading} from '@angular/router';

import {NgbDateAdapter, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import {
  baseUrlInterceptor,
  DfxPreloadStrategy,
  loggingInterceptor,
  postPutJsonContentTypeInterceptor,
  provideDfxHelper,
  WINDOW_PROVIDERS,
  withBaseUrlInterceptor,
  withLoggingInterceptor,
  withMobileBreakpoint,
} from 'dfx-helper';
import {provideDfxTranslate, withAutoTranslatedLanguages, withDefaultLanguage} from 'dfx-translate';
import {EnvironmentHelper} from './app/_shared/EnvironmentHelper';
import {authInterceptor} from './app/_shared/services/auth/auth-interceptor';
import {CustomDateAdapter, CustomDateParserFormatter} from './app/_shared/services/datepicker-adapter';

import {AppComponent} from './app/app.component';
import {ROUTES} from './app/app.routes';

import {CustomTitleStrategy} from './app/custom-title.strategy';
import {errorInterceptor} from './app/_shared/services/auth/error-interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideDfxHelper(
      withMobileBreakpoint(767),
      withBaseUrlInterceptor(EnvironmentHelper.getAPIUrl(), ['assets/i18n']),
      withLoggingInterceptor(['json', '/auth/signIn', '/auth/signInPwChange'])
    ),
    provideDfxTranslate(withDefaultLanguage('de'), withAutoTranslatedLanguages(['en', 'es', 'fr', 'it', 'pt'])),
    provideAnimations(),
    DfxPreloadStrategy,
    provideRouter(ROUTES, withPreloading(DfxPreloadStrategy)),
    {
      provide: LOCALE_ID,
      useValue: 'de-AT',
    },
    {
      provide: TitleStrategy,
      useClass: CustomTitleStrategy,
    },
    {provide: NgbDateAdapter, useClass: CustomDateAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    provideHttpClient(
      withInterceptors([baseUrlInterceptor, postPutJsonContentTypeInterceptor, loggingInterceptor, authInterceptor, errorInterceptor])
    ),
    WINDOW_PROVIDERS,
  ],
}).catch((err) => console.error(err));

registerLocaleData(localeDe, localeDeExtra);
