import {Injectable, signal} from '@angular/core';

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