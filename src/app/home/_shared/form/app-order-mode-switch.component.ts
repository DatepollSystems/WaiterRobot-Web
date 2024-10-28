import {ChangeDetectionStrategy, Component, Input, booleanAttribute, output} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {skip} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';

@Component({
  template: `
    <div class="form-check form-switch mb-0">
      <input class="form-check-input" id="orderMode" [formControl]="formControl" type="checkbox" role="switch" />
      <label class="form-check-label text-nowrap" for="orderMode">{{ 'ORDER_MODE_SWITCH' | transloco }}</label>
    </div>
  `,
  selector: 'app-order-mode-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoPipe],
})
export class AppOrderModeSwitchComponent {
  formControl = new FormControl(false);

  readonly orderModeChange = output<boolean>();

  @Input({transform: booleanAttribute})
  set orderMode(it: boolean) {
    this.formControl.setValue(it);
  }

  constructor() {
    this.formControl.valueChanges.pipe(takeUntilDestroyed(), skip(1)).subscribe((value) => {
      this.orderModeChange.emit(value ?? false);
    });
  }
}
