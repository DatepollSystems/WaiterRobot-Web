import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';

import {NgbDropdown, NgbDropdownButtonItem, NgbDropdownItem, NgbDropdownMenu, NgbDropdownToggle} from '@ng-bootstrap/ng-bootstrap';

import {BiComponent, BiName, circleHalf, moonStarsFill, provideIcons, sunFill} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

interface Theme {
  id: 'auto' | 'dark' | 'light';
  name: string;
  icon: BiName;
}

@Component({
  template: `
    <div ngbDropdown display="dynamic">
      <a class="nav-link" id="themeDropdown" ngbDropdownToggle>
        <bi [name]="currentTheme().icon" class="text-body-emphasis" ariaLabel="Theme picker" />
      </a>
      <div ngbDropdownMenu aria-labelledby="themeDropdown" class="p-1">
        @for (theme of themes; track theme.id) {
          <button ngbDropdownItem class="rounded-1 mt-1" [class.active]="theme.id === currentTheme().id" (click)="setTheme(theme.id)">
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
  imports: [
    ReactiveFormsModule,
    BiComponent,
    DfxTr,
    NgbDropdownButtonItem,
    NgbDropdownItem,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
  ],
  providers: [provideIcons({circleHalf, sunFill, moonStarsFill})],
})
export class ThemePickerComponent {
  themes: Theme[] = [
    {id: 'auto', name: 'Auto', icon: 'circle-half'},
    {id: 'light', name: 'Light', icon: 'sun-fill'},
    {id: 'dark', name: 'Dark', icon: 'moon-stars-fill'},
  ];

  currentTheme = signal<Theme>(this.themes[0]);

  constructor() {
    const theme = this.themes.find((t) => t.id === localStorage.getItem('theme'));
    if (theme) {
      this.currentTheme.set(theme);
    }
    this.setTheme(this.getPreferredTheme().id);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.currentTheme().id !== 'light' || this.currentTheme().id !== 'dark') {
        this.setTheme(this.getPreferredTheme().id);
      }
    });
  }

  getPreferredTheme(): Theme {
    if (this.currentTheme) {
      return this.currentTheme();
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.themes.find((t) => t.id === 'dark')!;
    } else {
      return this.themes.find((t) => t.id === 'light')!;
    }
  }

  setTheme(id: Theme['id']): void {
    const theme = this.themes.find((t) => t.id === id)!;
    this.currentTheme.set(theme);
    localStorage.setItem('theme', theme.id);
    if (theme.id === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme.id);
    }
  }
}
