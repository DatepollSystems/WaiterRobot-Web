import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {NgbDropdownItem} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent} from 'dfx-bootstrap-icons';

import {ThemeService} from './theme.service';

@Component({
  template: `
    <button ngbDropdownItem class="d-inline-flex gap-2 align-items-center" (click)="changeTheme()">
      <bi [name]="themeService.currentTheme().icon" class="text-body-emphasis" ariaLabel="Theme picker" />
      Theme: {{ themeService.currentTheme().name }}
    </button>
  `,
  selector: 'theme-picker',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BiComponent, NgbDropdownItem],
})
export class ThemePickerComponent {
  themeService = inject(ThemeService);

  changeTheme(): void {
    const currentTheme = this.themeService.currentTheme();
    switch (currentTheme.id) {
      case 'auto':
        this.themeService.setTheme('light');
        break;
      case 'light':
        this.themeService.setTheme('dark');
        break;
      case 'dark':
        this.themeService.setTheme('auto');
    }
  }
}
