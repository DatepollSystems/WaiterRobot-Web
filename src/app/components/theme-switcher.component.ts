import {Component, inject} from '@angular/core';

import {NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';

import {ThemeService} from '../services/theme.service';

@Component({
  template: `
    <div class="theme-switcher">
      <div ngbDropdown display="dynamic">
        <button class="btn btn-primary" type="button" ngbDropdownToggle>
          <bi [name]="themeService.selectedTheme().icon" />
        </button>
        <div class="p-1" ngbDropdownMenu aria-labelledby="themeDropdown">
          @for (theme of themeService.themes; track theme.id) {
            <button
              class="rounded-1 mt-1"
              [class.active]="theme.id === themeService.selectedTheme().id"
              (mousedown)="themeService.setTheme(theme.id)"
              type="button"
              ngbDropdownItem
            >
              <bi [name]="theme.icon" />
              {{ theme.name }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .theme-switcher {
      z-index: 1000;
      right: 20px;
      bottom: 40px;
      position: fixed;
    }
  `,
  imports: [BiComponent, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle],
  selector: 'app-theme-switcher',
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);
}
