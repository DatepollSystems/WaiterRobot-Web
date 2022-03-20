import {LOCALE_ID, NgModule} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';

import {NgbDateAdapter, NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';

import {AppRoutingModule} from './app-routing.module';
import {CustomDateAdapter, CustomDateParserFormatter} from './_services/datepicker-adapter';
import {WINDOW_PROVIDERS} from './_services/windows-provider';
import {AuthInterceptor} from './_services/auth/auth-interceptor';

import {AppComponent} from './app.component';
import {ToastsContainerComponent} from './_services/notifications/toasts-container.component';
import {DfxHelperModule} from 'dfx-helper';

@NgModule({
  declarations: [AppComponent, ToastsContainerComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    NgbModule,
    DfxHelperModule.setup(),
    DfxTranslateModule.setup({defaultLanguage: 'de'}),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'de-AT',
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
