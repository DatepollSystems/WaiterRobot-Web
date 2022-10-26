import {registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TitleStrategy} from '@angular/router';

import {NgbDateAdapter, NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {BaseUrlInterceptor, DfxHelperModule, DfxTrackByModule, LoggingInterceptor, PostPutJsonContentTypeInterceptor} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {EnvironmentHelper} from './_shared/EnvironmentHelper';

import {AuthInterceptor} from './_shared/services/auth/auth-interceptor';
import {CustomDateAdapter, CustomDateParserFormatter} from './_shared/services/datepicker-adapter';
import {ToastsContainerComponent} from './notifications/toasts-container.component';
import {WINDOW_PROVIDERS} from './_shared/services/windows-provider';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CustomTitleStrategy} from './custom-title.strategy';

@NgModule({
  declarations: [AppComponent, ToastsContainerComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    DfxHelperModule.setup({
      isMobileBreakpoint: 767,
      baseUrl: EnvironmentHelper.getAPIUrl(),
      baseUrlInterceptorIgnorePaths: ['assets/i18n'],
      loggingInterceptorIgnorePaths: ['json', '/auth/signIn', '/auth/signInPwChange'],
    }),
    DfxTranslateModule.setup({defaultLanguage: 'de', languagesWithAutoTranslation: ['en', 'es', 'fr', 'it', 'pt']}),
    DfxTrackByModule,
    LoadingBarRouterModule,
  ],
  providers: [
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

registerLocaleData(localeDe, localeDeExtra);
