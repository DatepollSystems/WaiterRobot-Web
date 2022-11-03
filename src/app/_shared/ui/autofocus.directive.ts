import {Directive, ElementRef, Inject, Input, OnInit} from '@angular/core';
import {ADirective} from 'dfx-helper';
import {WINDOW} from '../services/windows-provider';
import {coerceNumberProperty, NumberInput} from '@angular/cdk/coercion';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[focus]',
  standalone: true,
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class DfxAutofocus extends ADirective implements OnInit {
  @Input() set autof(it: NumberInput) {
    this.delay = coerceNumberProperty(it);
  }
  delay = 100;

  constructor(@Inject(WINDOW) private window: Window, private elRef: ElementRef) {
    super();
  }

  ngOnInit(): void {
    this.clearTimeout(
      this.window.setTimeout(() => {
        this.elRef.nativeElement.focus();
      }),
      this.delay
    );
  }
}
