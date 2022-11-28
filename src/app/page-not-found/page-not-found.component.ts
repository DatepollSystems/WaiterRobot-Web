import {Component} from '@angular/core';

import {DfxTr} from 'dfx-translate';

import {AppLogoWithTextComponent} from '../_shared/ui/app-logo-with-text.component';
import {FooterModule} from '../_shared/ui/footer/footer.module';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-page-not-found',
  template: `
    <div class="d-container text-white">
      <div class="container-sm px-5">
        <app-logo-with-text></app-logo-with-text>
        <div class="d-flex flex-column align-items-center gap-4" style="margin-top: 5%; padding-bottom: 10%">
          <div>
            <img style="max-width: 100%" fill ngSrc="assets/404.webp" priority alt="Image of cat which hides" />
          </div>
          <div class="text-center">
            <h2>{{ '404_TITLE' | tr }}</h2>
          </div>
          <div>
            <button class="btn btn-primary btn-lg mt-4" style="margin-bottom: 15px" onclick="window.history.go(-1); return false;">
              {{ '404_GO_BACK' | tr }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styleUrls: ['../about/about.component.scss'],
  standalone: true,
  imports: [AppLogoWithTextComponent, FooterModule, DfxTr, NgOptimizedImage],
})
export class PageNotFoundComponent {}
