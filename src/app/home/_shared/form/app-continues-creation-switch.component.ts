import {booleanAttribute, ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {TranslocoPipe} from '@ngneat/transloco';

import {Subscription} from 'rxjs';

@Component({
  template: `
    <div class="form-check form-switch mb-0">
      <input class="form-check-input" type="checkbox" role="switch" id="continuousCreation" [formControl]="formControl" />
      <label class="form-check-label text-nowrap" for="continuousCreation">{{ text | transloco }}</label>
    </div>
  `,
  selector: 'app-continues-creation-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoPipe],
})
export class AppContinuesCreationSwitchComponent implements OnDestroy {
  formControl = new FormControl(false);

  @Output()
  readonly continuesCreationChange = new EventEmitter<boolean>();

  @Input({transform: booleanAttribute})
  set continuesCreation(it: boolean) {
    this.formControl.setValue(it);
  }

  @Input() text = 'CONTINUOUS_CREATION';

  subscription?: Subscription;

  constructor() {
    this.subscription = this.formControl.valueChanges.subscribe((value) => {
      this.continuesCreationChange.next(value ?? false);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscription = undefined;
  }
}
