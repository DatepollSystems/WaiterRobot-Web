// noinspection NonAsciiCharacters,JSNonASCIINames

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {AbstractControl, FormBuilder, FormControlStatus, FormGroup, ɵFormGroupValue} from '@angular/forms';

import {delay, distinctUntilChanged, EMPTY, Observable, of, startWith, tap} from 'rxjs';

import {IHasID, loggerOf} from 'dfts-helper';
import {AComponent} from 'dfx-helper';

const focuses = ['input', 'select', 'textarea'];

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractModelEditFormComponent<CreateDTOType, UpdateDTOType extends IHasID<UpdateDTOType['id']>>
  extends AComponent
  implements OnInit, AfterViewInit
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
  }

  _isEdit = true;

  abstract form: FormGroup;
  @ViewChild('formRef') formRef?: ElementRef;

  formStatusChanges?: Observable<FormControlStatus>;

  @Input()
  set formDisabled(it: boolean) {
    if (it) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  ngOnInit(): void {
    this.formStatusChanges = this.form.statusChanges.pipe(
      startWith(this.form.valid ? ('VALID' as FormControlStatus) : ('INVALID' as FormControlStatus)),
      distinctUntilChanged(),
      tap((formStatus) => {
        const valid = formStatus === 'VALID' ? 'VALID' : 'INVALID';
        this.lumber.log('formValidChange', `is valid = ${valid}`, this.form.value);
        this.formValid.emit(valid);
      }),
    );
  }

  ngAfterViewInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const input = this.formRef?.nativeElement.querySelector(focuses.join(','));
    if (input && !this._isEdit) {
      of(EMPTY)
        .pipe(delay(1))
        .subscribe(() => {
          input.focus();
          this.lumber.log('ngAfterViewInit', 'Input to focus', input);
        });
    } else if (!input) {
      this.lumber.log('ngAfterViewInit', 'No input found to focus');
    }
  }

  protected overrideRawValue(value: typeof this.form.value): unknown {
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const input = this.formRef?.nativeElement.querySelector(focuses.join(','));
    if (input) {
      input.focus();
      this.lumber.log('reset', 'Input to focus', input);
    } else {
      this.lumber.log('reset', 'No input found to focus');
    }
  }

  patchValue<
    TControl extends {
      [K in keyof TControl]: AbstractControl<unknown>;
    } = object,
  >(value: ɵFormGroupValue<TControl>): void {
    this.form.patchValue(value);
  }
}
