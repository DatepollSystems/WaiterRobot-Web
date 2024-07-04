import {inject, Pipe, PipeTransform} from '@angular/core';
import {ThemeService} from '@shared/services/theme.service';

@Pipe({
  name: 'adjustDarkModeColor',
  standalone: true,
})
export class AppAdjustDarkModeColor implements PipeTransform {
  theme = inject(ThemeService).currentTheme
  transform(color?: string | null): string | null {
    return color ? adjustColorForDarkMode(color, this.theme().id === 'dark') : null;
  }
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

function hexToHsv(hex: string): HSV {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h: number, s: number, v = max;

  let d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0; // safety case, should not happen
    }
    h /= 6;
  }

  return { h: h, s: s, v: v };
}

function hsvToHex(h: number, s: number, v: number): string {
  let r: number, g: number, b: number;

  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
    default: r = 0, g = 0, b = 0; // safety case, should not happen
  }

  return `#${((1 << 24) + (Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255)).toString(16).slice(1)}`;
}

function adjustColorForDarkMode(hexColor: string, darkMode: boolean): string {
  if (!darkMode) {
    return hexColor;
  }

  let hsv = hexToHsv(hexColor);
  let newSaturation = hsv.s * 0.6;
  return hsvToHex(hsv.h, newSaturation, hsv.v);
}

