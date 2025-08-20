import {Component, effect, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NavigationEnd, Router} from '@angular/router';

import {filter} from 'rxjs';

import {NgbActiveOffcanvas} from '@ng-bootstrap/ng-bootstrap';
import {IsMobileService} from 'dfx-helper';

import {Nav} from './nav';

@Component({
  template: `
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvas-mobile-nav">Navigation</h5>
      <button class="btn-close text-reset" (mousedown)="activeOffcanvas.close()" type="button" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <app-nav class="d-flex flex-column" />
    </div>
  `,
  styles: `
    /* Opening offcanvas as a component requires this style in order to scroll */
    :host {
      height: 100vh;
      min-height: 100%;
      display: flex;
      flex-direction: column;
    }
  `,
  selector: 'app-mobile-nav',
  imports: [Nav],
})
export class MobileNav {
  activeOffcanvas = inject(NgbActiveOffcanvas);

  constructor() {
    inject(Router)
      .events.pipe(
        takeUntilDestroyed(),
        filter((it) => it instanceof NavigationEnd),
      )
      .subscribe(() => {
        this.activeOffcanvas.close();
      });

    const isMobile = inject(IsMobileService).isMobile;

    effect(() => {
      if (!isMobile()) {
        this.activeOffcanvas.close();
      }
    });
  }
}
