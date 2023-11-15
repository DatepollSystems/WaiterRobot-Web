import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {ThemeService} from './theme.service';

@Component({
  template: `
    <div ngbDropdown display="dynamic">
      <a class="nav-link" id="themeDropdown" ngbDropdownToggle>
        <bi [name]="themeService.currentTheme().icon" class="text-body-emphasis" ariaLabel="Theme picker" />
      </a>
      <div ngbDropdownMenu aria-labelledby="themeDropdown" class="p-1">
        @for (theme of themeService.themes; track theme.id) {
          <button
            ngbDropdownItem
            class="rounded-1 mt-1"
            [class.active]="theme.id === themeService.currentTheme().id"
            (click)="themeService.setTheme(theme.id)"
          >
            <bi [name]="theme.icon" />
            {{ theme.name }}
          </button>
        }
      </div>
    </div>
  `,
  styles: `
  a {
    text-decoration: none;
  }
  `,
  selector: 'theme-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BiComponent, DfxTr, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdown, NgbDropdownToggle, NgbDropdownMenu],
})
export class ThemePickerComponent {
  themeService = inject(ThemeService);
}
