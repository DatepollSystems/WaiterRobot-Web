import {Location, NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Router} from '@angular/router';

import {n_fromStorage, st_set} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';

import {AppLogoWithTextComponent} from './_shared/ui/app-logo-with-text.component';
import {AppOutsideLayoutComponent} from './_shared/ui/app-outside-layout.component';
import {FooterModule} from './_shared/ui/footer/footer.module';

@Component({
  selector: 'app-page-not-found',
  template: `
    <outside-layout-component>
      <div class="d-flex justify-content-center">
        <img ngSrc="/assets/404.webp" priority width="400" height="320" alt="Image of cat which hides in a box" />
      </div>
      <h2 class="text-center mt-5">{{ '404_TITLE' | tr }}</h2>
      <button class="btn btn-primary btn-lg mt-5 mb-4 w-100" (click)="goBack()">
        {{ 'GO_BACK' | tr }}
      </button>
    </outside-layout-component>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppLogoWithTextComponent, FooterModule, DfxTr, NgOptimizedImage, AppOutsideLayoutComponent],
})
export class PageNotFoundComponent {
  location = inject(Location);
  currentNavigationId = (this.location.getState() as {navigationId: number}).navigationId;
  router = inject(Router);

  constructor() {
    const lastLocationState = n_fromStorage('404_location_state');

    if (lastLocationState !== undefined && lastLocationState + 2 === this.currentNavigationId) {
      void this.router.navigateByUrl('/');
    }
  }

  goBack(): void {
    st_set('404_location_state', this.currentNavigationId);
    this.location.back();
  }
}
