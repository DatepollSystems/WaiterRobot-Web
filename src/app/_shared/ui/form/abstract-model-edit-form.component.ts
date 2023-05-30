import {ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormControlStatus, FormGroup, ɵFormGroupValue} from '@angular/forms';
import {IHasID, loggerOf} from 'dfts-helper';
import {AComponent} from 'dfx-helper';
import {Observable, tap} from 'rxjs';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractModelEditFormComponent<CreateDTOType, UpdateDTOType extends IHasID<UpdateDTOType['id']>>
  extends AComponent
  implements OnInit
{
  lumber = loggerOf('AModelEditForm');

  fb = inject(FormBuilder);

  @Output()
  formValid = new EventEmitter<'VALID' | 'INVALID'>();

  @Output()
  submitCreate = new EventEmitter<CreateDTOType>();

  @Output()
  submitUpdate = new EventEmitter<UpdateDTOType>();

  protected set isEdit(it: boolean) {
    this._isEdit = it;
    if (!this._isEdit) {
      this.reset();
    }
  }

  _isEdit = true;

  abstract form: FormGroup;

  formStatusChanges?: Observable<FormControlStatus>;

  ngOnInit(): void {
    const firstValid = this.form.valid ? 'VALID' : 'INVALID';
    this.formValid.emit(firstValid);
    this.lumber.log('formValidChange', 'valid', firstValid);
    this.formStatusChanges = this.form.statusChanges.pipe(
      tap((formStatus) => {
        const valid = formStatus === 'VALID' ? 'VALID' : 'INVALID';
        this.lumber.log('formValidChange', 'valid', valid);
        this.lumber.log('formValidChange', 'error', this.form.value);
        this.formValid.emit(valid);
      })
    );
  }

  protected overrideRawValue(value: typeof this.form.value): any {
    return value;
  }

  submit(): void {
    const formValue = this.overrideRawValue(this.form.getRawValue());
    if (this._isEdit) {
      this.submitUpdate.emit(formValue as UpdateDTOType);
      return;
    }
    this.submitCreate.emit(formValue as CreateDTOType);
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
