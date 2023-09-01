import {booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {Subscription} from 'rxjs';

import {DfxTr} from 'dfx-translate';

@Component({
  template: `
    <div class="form-check form-switch mb-0">
      <input [formControl]="formControl" class="form-check-input" type="checkbox" role="switch" id="continuousCreation" />
      <label class="form-check-label text-nowrap" for="continuousCreation">{{ text | tr }}</label>
    </div>
  `,
  selector: 'app-continues-creation-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DfxTr],
})
export class AppContinuesCreationSwitchComponent implements OnDestroy {
  formControl = new FormControl(false);

  @Output()
  continuesCreationChange = new EventEmitter<boolean>();

  @Input({transform: booleanAttribute})
  set continuesCreation(it: boolean) {
    this.formControl.setValue(it);
  }

  @Input() text = 'CONTINUOUS_CREATION';

  subscription?: Subscription;

  constructor() {
    this.subscription = this.formControl.valueChanges.subscribe((value) => {
      this.continuesCreationChange.next(value === null ? false : value);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }
}
