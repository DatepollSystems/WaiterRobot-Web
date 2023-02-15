import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, inject, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ɵFormGroupValue} from '@angular/forms';
import {IHasID, loggerOf} from 'dfts-helper';
import {AComponent} from 'dfx-helper';

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractModelEditFormComponent<CreateDTOType, UpdateDTOType extends IHasID<UpdateDTOType['id']>>
  extends AComponent
  implements AfterViewInit
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

  constructor() {
    super();
  }

  private lastFormValid?: boolean;
  ngAfterViewInit(): void {
    this.formValid.emit(this.form.valid ? 'VALID' : 'INVALID');
    this.lastFormValid = this.form.valid;
    this.lumber.log('formValidChange', 'form', this.form.valid);
    this.unsubscribe(
      this.form.statusChanges.subscribe(() => {
        if (this.form.valid !== this.lastFormValid) {
          this.lastFormValid = this.form.valid;
          this.lumber.log('formValidChange', 'form', this.form.valid);
          this.formValid.emit(this.form.valid ? 'VALID' : 'INVALID');
        }
      })
    );
  }

  protected overrideRawValue(value: any): any {
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
