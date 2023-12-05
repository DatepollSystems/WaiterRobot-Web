import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet} from '@angular/router';

import {NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';

import {ThemeService} from '../_shared/services/theme.service';

@Component({
  template: `
    <div class="container container-md pt-5">
      <router-outlet />
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
  `,
  styles: [
    `
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
  imports: [NgbDropdown, NgbDropdownMenu, NgbDropdownItem, NgbDropdownToggle, NgbDropdownButtonItem, RouterOutlet, BiComponent],
  standalone: true,
})
export class MaxiLayout {
  themeService = inject(ThemeService);
}
