import {ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ɵFormGroupValue} from '@angular/forms';
import {AComponent} from 'dfx-helper';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractModelEditFormComponent<CreateDTOType, UpdateDTOType> extends AComponent implements OnInit {
  fb = inject(FormBuilder);

  @Output()
  formValid = new EventEmitter<'VALID' | 'INVALID'>();

  @Output()
  submitCreate = new EventEmitter<CreateDTOType>();

  @Output()
  submitUpdate = new EventEmitter<UpdateDTOType>();

  isEdit = true;

  abstract form: FormGroup;

  ngOnInit(): void {
    this.formValid.emit(this.form.valid ? 'VALID' : 'INVALID');
    this.unsubscribe(
      this.form.statusChanges.subscribe(() => {
        this.formValid.emit(this.form.valid ? 'VALID' : 'INVALID');
      })
    );
  }

  submit(): void {
    console.log('form', this.form.getRawValue());
    if (this.isEdit) {
      this.submitUpdate.emit(this.form.getRawValue());
      return;
    }
    this.submitCreate.emit(this.form.getRawValue());
  }

  reset(): void {
    this.form.reset();
  }

  patchValue<
    TControl extends {
      [K in keyof TControl]: AbstractControl<any>;
    } = any
  >(value: ɵFormGroupValue<TControl>): void {
    this.form.patchValue(value);
  }
}
