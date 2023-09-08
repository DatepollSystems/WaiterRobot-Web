import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'isLightColor',
  standalone: true,
  pure: true,
})
export class AppIsLightColorPipe implements PipeTransform {
  transform(color: string | undefined | null): boolean {
    return color ? isColorLight(color) : false;
  }
}

function isColorLight(color: string): boolean {
  // Remove any leading '#' if present
  color = color.replace(/^#/, '');

  // Parse the color string into RGB components
  const red = parseInt(color.slice(0, 2), 16) / 255;
  const green = parseInt(color.slice(2, 4), 16) / 255;
  const blue = parseInt(color.slice(4, 6), 16) / 255;

  // Calculate the relative luminance
  const luminance = 0.2126 * gammaCorrect(red) + 0.7152 * gammaCorrect(green) + 0.0722 * gammaCorrect(blue);

  // Determine if the color is dark or light based on a threshold value
  return luminance > 0.5;
}

// Gamma correction helper function
function gammaCorrect(value: number): number {
  return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}
