import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {DfxTr} from 'dfx-translate';
import {Subscription} from 'rxjs';

@Component({
  template: `
    <div class="form-check form-switch mt-2">
      <input [formControl]="formControl" class="form-check-input" type="checkbox" role="switch" id="continuousCreation" />
      <label class="form-check-label" for="continuousCreation">{{ text | tr }}</label>
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

  @Input()
  set continuesCreation(it: BooleanInput) {
    this.formControl.setValue(coerceBooleanProperty(it));
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
