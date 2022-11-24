import {registerLocaleData} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {LOCALE_ID, NgModule} from '@angular/core';
import {TitleStrategy} from '@angular/router';

import {NgbDateAdapter, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {BaseUrlInterceptor, DfxHelperModule, DfxTrackByModule, LoggingInterceptor, PostPutJsonContentTypeInterceptor} from 'dfx-helper';
import {DfxTranslateModule} from 'dfx-translate';
import {EnvironmentHelper} from './_shared/EnvironmentHelper';

import {AuthInterceptor} from './_shared/services/auth/auth-interceptor';
import {CustomDateAdapter, CustomDateParserFormatter} from './_shared/services/datepicker-adapter';
import {AppComponent} from './app.component';
import {CustomTitleStrategy} from './custom-title.strategy';

@NgModule({
  declarations: [],
  imports: [
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

registerLocaleData(localeDe, localeDeExtra);
