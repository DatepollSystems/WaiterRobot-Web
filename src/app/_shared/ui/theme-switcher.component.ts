import {Component, inject} from '@angular/core';
import {NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';
import {ThemeService} from '@shared/services/theme.service';
import {BiComponent} from 'dfx-bootstrap-icons';

@Component({
  template: `
    <div class="theme-switcher">
      <div ngbDropdown display="dynamic">
        <button type="button" class="btn btn-primary" ngbDropdownToggle>
          <bi [name]="themeService.selectedTheme().icon" />
        </button>
        <div ngbDropdownMenu aria-labelledby="themeDropdown" class="p-1">
          @for (theme of themeService.themes; track theme.id) {
            <button
              type="button"
              ngbDropdownItem
              class="rounded-1 mt-1"
              [class.active]="theme.id === themeService.selectedTheme().id"
              (mousedown)="themeService.setTheme(theme.id)"
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
  standalone: true,
  imports: [BiComponent, NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle],
  selector: 'app-theme-switcher',
})
export class ThemeSwitcherComponent {
  themeService = inject(ThemeService);
}
