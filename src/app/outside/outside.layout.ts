import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';

import {ThemeService} from '../_shared/services/theme.service';
import {FooterModule} from '../_shared/ui/footer/footer.module';
import {AppLogoWithTextComponent} from './_shared/app-logo-with-text.component';

@Component({
  template: `
    <div class="d-container">
      <div class="container-md d-flex flex-column align-items-center gap-5">
        <app-logo-with-text />
        <div class="col-10 col-sm-8 col-md-6 co-lg-6 col-xl-4 d-flex flex-column align-items-center gap-4">
          <div class="w-100">
            <router-outlet />
          </div>
        </div>
      </div>
    </div>
    <div class="theme-switcher">
      <div ngbDropdown display="dynamic">
        <button type="button" class="btn btn-primary" ngbDropdownToggle>
          <bi [name]="themeService.selectedTheme().icon" />
        </button>
        <div ngbDropdownMenu aria-labelledby="themeDropdown" class="p-1">
          @for (theme of themeService.themes; track theme.id) {
            <button
              ngbDropdownItem
              class="rounded-1 mt-1"
              [class.active]="theme.id === themeService.selectedTheme().id"
              (click)="themeService.setTheme(theme.id)"
            >
              <bi [name]="theme.icon" />
              {{ theme.name }}
            </button>
          }
        </div>
      </div>
    </div>
    <app-footer container="container-md " />
  `,
  styles: [
    `
      .d-container {
        min-height: 95%;
        background-color: var(--bs-tertiary-bg);
        padding-top: 6%;
        padding-bottom: 6%;
      }

      .theme-switcher {
        z-index: 1000;
        right: 20px;
        bottom: 40px;
        position: fixed;
      }
    `,
  ],
  selector: 'app-outside-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AppLogoWithTextComponent,
    FooterModule,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgbDropdownToggle,
    BiComponent,
    NgbDropdownButtonItem,
    RouterOutlet,
  ],
  standalone: true,
})
export class OutsideLayout {
  themeService = inject(ThemeService);
}
