import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {DfxTranslateModule} from 'dfx-translate';
import {HttpClientModule} from '@angular/common/http';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FlexLayoutModule,
    NgbModule,
    DfxTranslateModule,
    DfxTranslateModule.setup({defaultLanguage: 'de'})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
