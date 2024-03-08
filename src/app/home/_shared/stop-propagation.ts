import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[stopPropagation]',
  standalone: true,
})
export class StopPropagationDirective {
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
