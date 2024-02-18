import {booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <div class="form-check form-switch mb-0">
      <input class="form-check-input" type="checkbox" role="switch" id="orderMode" [formControl]="formControl" />
      <label class="form-check-label text-nowrap" for="orderMode">{{ 'ORDER_MODE_SWITCH' | tr }}</label>
    </div>
  `,
  selector: 'app-order-mode-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DfxTr],
})
export class AppOrderModeSwitchComponent {
  formControl = new FormControl(false);

  @Output()
  readonly orderModeChange = new EventEmitter<boolean>();

  @Input({transform: booleanAttribute})
  set orderMode(it: boolean) {
    this.formControl.setValue(it);
  }

  constructor() {
    this.formControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.orderModeChange.next(value ?? false);
    });
  }
}
