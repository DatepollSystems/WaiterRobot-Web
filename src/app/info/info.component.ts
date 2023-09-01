import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

import {DfxTr} from 'dfx-translate';

import {FooterModule} from '../_shared/ui/footer/footer.module';

@Component({
  template: `
    <div style="min-height: 90vh" class="py-4 bg">
      <div class="container-xl d-flex flex-column flex-md-row gap-3">
        <div class="col-md-5 col-lg-3">
          <ul class="list-group text-nowrap">
            <a class="list-group-item list-group-item-action" routerLink="imprint" routerLinkActive="active">{{ 'ABOUT_IMPRINT' | tr }}</a>
            <a class="list-group-item list-group-item-action" routerLink="privacypolicy" routerLinkActive="active">{{
              'ABOUT_PRIVACY_POLICY_WEB' | tr
            }}</a>
            <a class="list-group-item list-group-item-action" routerLink="mobile-privacypolicy" routerLinkActive="active">{{
              'ABOUT_MOBILE_PRIVACY_POLICY' | tr
            }}</a>
            <a class="list-group-item list-group-item-action" routerLink="/about">{{ 'GO_BACK' | tr }}</a>
          </ul>
        </div>
        <div class="text-white col-md-7 col-lg-9">
          <div class="card p-3">
            <div class="card-body">
              <div class="card-text" style="line-height: 27px">
                <router-outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <app-footer container="container-md" />
  `,
  styles: [
    `
      .bg {
        background-color: var(--bs-gray-900);
      }
    `,
  ],
  selector: 'app-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FooterModule, RouterLink, RouterOutlet, RouterLinkActive, DfxTr],
})
export class InfoComponent {}
