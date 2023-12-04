import {computed, effect, Injectable, signal} from '@angular/core';

import {BiName} from 'dfx-bootstrap-icons';

interface Theme {
  id: 'auto' | 'dark' | 'light';
  name: string;
  icon: BiName;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  themes: Theme[] = [
    {id: 'auto', name: 'Auto', icon: 'circle-half'},
    {id: 'light', name: 'Light', icon: 'sun-fill'},
    {id: 'dark', name: 'Dark', icon: 'moon-stars-fill'},
  ];

  private _selectedTheme = signal<Theme>(this.themes[0]);
  public selectedTheme = computed(() => this._selectedTheme());

  currentTheme = computed(() => {
    const theme = this._selectedTheme();
    return theme.id === 'auto' ? this.getPreferredTheme() : theme;
  });

  constructor() {
    const themeSetting = this.themes.find((t) => t.id === localStorage.getItem('theme'));
    if (themeSetting) {
      this._selectedTheme.set(themeSetting);
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => this._selectedTheme.set(this.getPreferredTheme()));

    effect(() => document.documentElement.setAttribute('data-bs-theme', this.currentTheme().id));
  }

  getPreferredTheme(): Theme {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.themes.find((t) => t.id === 'dark')!;
    } else {
      return this.themes.find((t) => t.id === 'light')!;
    }
  }

  setTheme(id: Theme['id']): void {
    const theme = this.themes.find((t) => t.id === id)!;
    this._selectedTheme.set(theme);
    localStorage.setItem('theme', id);
  }
}
