import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';

import {NgbDateAdapter, NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';

import {AppRoutingModule} from './app-routing.module';
import {AuthInterceptor} from './_services/auth/auth-interceptor';

import {AppComponent} from './app.component';
import {ToastsContainerComponent} from './_services/notifications/toasts-container.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {CustomDateAdapter, CustomDateParserFormatter} from './_services/datepicker-adapter';

@NgModule({
  declarations: [AppComponent, ToastsContainerComponent, PageNotFoundComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    NgbModule,
    DfxTranslateModule,
    DfxTranslateModule.setup({defaultLanguage: 'de'}),
  ],
  providers: [
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
