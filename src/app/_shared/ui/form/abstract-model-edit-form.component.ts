import {ChangeDetectionStrategy, Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ɵFormGroupValue} from '@angular/forms';
import {AComponent} from 'dfx-helper';
import {IHasID, loggerOf} from 'dfts-helper';

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
      this.form.reset();
    }
  }
  _isEdit = true;

  abstract form: FormGroup;

  ngOnInit(): void {
    this.formValid.emit(this.form.valid ? 'VALID' : 'INVALID');
    this.unsubscribe(
      this.form.statusChanges.subscribe(() => {
        this.formValid.emit(this.form.valid ? 'VALID' : 'INVALID');
      })
    );
  }

  protected overrideRawValue(value: any): any {
    return value;
  }

  submit(): void {
    const formValue = this.overrideRawValue(this.form.getRawValue());
    this.lumber.log('submit', 'form', formValue);
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
