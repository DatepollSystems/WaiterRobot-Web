import {booleanAttribute, ChangeDetectionStrategy, Component, Input, input, output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {TranslocoPipe} from '@jsverse/transloco';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  template: `
    <div class="form-check form-switch mb-0">
      <input class="form-check-input" type="checkbox" role="switch" id="continuousCreation" [formControl]="formControl" />
      <label class="form-check-label text-nowrap" for="continuousCreation">{{ text() | transloco }}</label>
    </div>
  `,
  selector: 'app-continues-creation-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TranslocoPipe],
})
export class AppContinuesCreationSwitchComponent {
  formControl = new FormControl(false);

  readonly continuesCreationChange = output<boolean>();

  @Input({transform: booleanAttribute})
  set continuesCreation(it: boolean) {
    this.formControl.setValue(it);
  }

  text = input('CONTINUOUS_CREATION');

  constructor() {
    this.formControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.continuesCreationChange.emit(value ?? false);
    });
  }
}
