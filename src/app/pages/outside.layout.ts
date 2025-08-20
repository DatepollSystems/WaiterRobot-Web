import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {FooterComponent} from '../components/footer/footer.component';
import {LogoWithText} from '../components/logo-with-text';
import {ThemeSwitcherComponent} from '../components/theme-switcher.component';

@Component({
  template: `
    <div class="d-container">
      <div class="container-md d-flex flex-column align-items-center gap-5">
        <logo-with-text />
        <div class="col-10 col-sm-8 col-md-6 co-lg-6 col-xl-4 d-flex flex-column align-items-center gap-4">
          <div class="w-100">
            <router-outlet />
          </div>
        </div>
      </div>
    </div>
    <app-theme-switcher />
    <app-footer container="container-md " />
  `,
  styles: `
    .d-container {
      min-height: 95%;
      background-color: var(--bs-body-bg);
      padding-top: 6%;
      padding-bottom: 6%;
    }
  `,
  selector: 'app-outside-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoWithText, RouterOutlet, FooterComponent, ThemeSwitcherComponent],
})
export class OutsideLayout {}
