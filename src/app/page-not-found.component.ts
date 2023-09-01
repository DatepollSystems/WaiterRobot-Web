import {Location, NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Router} from '@angular/router';

import {n_fromStorage, st_set} from 'dfts-helper';
import {DfxTr} from 'dfx-translate';

import {AppLogoWithTextComponent} from './_shared/ui/app-logo-with-text.component';
import {FooterModule} from './_shared/ui/footer/footer.module';

@Component({
  selector: 'app-page-not-found',
  template: `
    <div class="d-container text-white">
      <div class="container-sm px-5">
        <app-logo-with-text />
        <div class="d-flex flex-column align-items-center gap-4 mt-5 pb-4">
          <div>
            <img style="max-width: 100%" src="assets/404.webp" alt="Image of cat which hides" />
          </div>
          <div class="text-center mt-3">
            <h2>{{ '404_TITLE' | tr }}</h2>
          </div>
          <div>
            <button class="btn btn-primary btn-lg mt-4 mb-4" (click)="goBack()">
              {{ '404_GO_BACK' | tr }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <app-footer container="container-xxl" />
  `,
  styleUrls: ['./about/about.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppLogoWithTextComponent, FooterModule, DfxTr, NgOptimizedImage],
})
export class PageNotFoundComponent {
  location = inject(Location);
  currentNavigationId = (this.location.getState() as {navigationId: number}).navigationId;
  router = inject(Router);

  constructor() {
    const lastLocationState = n_fromStorage('404_location_state');

    if (lastLocationState !== undefined && lastLocationState + 2 === this.currentNavigationId) {
      void this.router.navigateByUrl('/home');
    }
  }

  goBack(): void {
    st_set('404_location_state', this.currentNavigationId);
    this.location.back();
  }
}
