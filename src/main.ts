import {registerLocaleData} from '@angular/common';

import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {importProvidersFrom, LOCALE_ID} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter, TitleStrategy, withPreloading} from '@angular/router';

import {NgbDateAdapter, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import {
  BaseUrlInterceptor,
  DfxHelperModule,
  DfxPreloadStrategy,
  LoggingInterceptor,
  PostPutJsonContentTypeInterceptor,
  WINDOW_PROVIDERS,
} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {EnvironmentHelper} from './app/_shared/EnvironmentHelper';
import {AuthInterceptor} from './app/_shared/services/auth/auth-interceptor';
import {CustomDateAdapter, CustomDateParserFormatter} from './app/_shared/services/datepicker-adapter';
import {ROUTES} from './app/app-routing.module';

import {AppComponent} from './app/app.component';

import {CustomTitleStrategy} from './app/custom-title.strategy';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      DfxHelperModule.setup({
        isMobileBreakpoint: 767,
        baseUrl: EnvironmentHelper.getAPIUrl(),
        baseUrlInterceptorIgnorePaths: ['assets/i18n'],
        loggingInterceptorIgnorePaths: ['json', '/auth/signIn', '/auth/signInPwChange'],
      }),
      DfxTranslateModule.setup({defaultLanguage: 'de', languagesWithAutoTranslation: ['en', 'es', 'fr', 'it', 'pt']})
    ),
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PostPutJsonContentTypeInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {provide: NgbDateAdapter, useClass: CustomDateAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter},
    WINDOW_PROVIDERS,
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));

registerLocaleData(localeDe, localeDeExtra);
