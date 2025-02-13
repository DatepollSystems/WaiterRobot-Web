import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {NgbDropdownItem} from '@ng-bootstrap/ng-bootstrap';
import {BiComponent} from 'dfx-bootstrap-icons';

import {ThemeService} from '@shared/services/theme.service';

@Component({
  template: `
    <button class="d-inline-flex gap-2 align-items-center" (mousedown)="changeTheme()" type="button" name="Theme switcher" ngbDropdownItem>
      <bi class="text-body-emphasis" [name]="themeService.selectedTheme().icon" ariaLabel="Theme picker" />
      Theme: {{ themeService.selectedTheme().name }}
    </button>
  `,
  selector: 'theme-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BiComponent, NgbDropdownItem],
})
export class ThemePickerComponent {
  themeService = inject(ThemeService);

  changeTheme(): void {
    const selectedTheme = this.themeService.selectedTheme();
    switch (selectedTheme.id) {
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
