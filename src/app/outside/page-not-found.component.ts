import {Location, NgOptimizedImage} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {TranslocoPipe} from '@ngneat/transloco';

import {n_fromStorage, st_set} from 'dfts-helper';

@Component({
  selector: 'app-page-not-found',
  template: `
    <div class="d-flex justify-content-center">
      <img ngSrc="/assets/404.webp" priority width="400" height="320" alt="Image of cat which hides in a box" />
    </div>
    <h2 class="text-center mt-5">{{ '404_TITLE' | transloco }}</h2>
    <button type="button" class="btn btn-primary btn-lg mt-5 mb-4 w-100" (click)="goBack()">
      {{ 'GO_BACK' | transloco }}
    </button>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, NgOptimizedImage],
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
