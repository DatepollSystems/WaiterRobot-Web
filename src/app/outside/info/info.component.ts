import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

import {TranslocoPipe} from '@ngneat/transloco';
import {FooterComponent} from '@shared/ui/footer/footer.component';
import {ThemeSwitcherComponent} from '@shared/ui/theme-switcher.component';

@Component({
  template: `
    <div style="min-height: 95vh" class="py-4">
      <div class="container-xl d-flex flex-column flex-md-row gap-3">
        <div class="col-md-5 col-lg-3">
          <ul class="list-group text-nowrap">
            <a class="list-group-item list-group-item-action" routerLink="imprint" routerLinkActive="active">{{
              'ABOUT_IMPRINT' | transloco
            }}</a>
            <a class="list-group-item list-group-item-action" routerLink="privacypolicy" routerLinkActive="active">{{
              'ABOUT_PRIVACY_POLICY_WEB' | transloco
            }}</a>
            <a class="list-group-item list-group-item-action" routerLink="mobile-privacypolicy" routerLinkActive="active">{{
              'ABOUT_MOBILE_PRIVACY_POLICY' | transloco
            }}</a>
            <a class="list-group-item list-group-item-action" routerLink="/login">{{ 'GO_BACK' | transloco }}</a>
          </ul>
        </div>
        <div class="col-md-7 col-lg-9">
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
    <app-theme-switcher />
    <app-footer container="container-md" />
  `,
  selector: 'app-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterOutlet, RouterLinkActive, TranslocoPipe, FooterComponent, ThemeSwitcherComponent],
})
export class InfoComponent {}
