// noinspection JSNonASCIINames NonAsciiCharacters

import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, Input, output, signal, viewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ɵFormGroupValue} from '@angular/forms';

import {loggerOf} from 'dfts-helper';

const focuses = ['input', 'select', 'textarea'];

@Component({
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractModelEditFormComponent<CreateDTOType, UpdateDTOType> implements AfterViewInit {
  lumber = loggerOf('AModelEditForm');

  fb = inject(FormBuilder);

  readonly submitCreate = output<CreateDTOType>();

  readonly submitUpdate = output<UpdateDTOType>();

  isCreating = signal(false);

  abstract form: FormGroup;
  formRef = viewChild<ElementRef>('formRef');

  @Input()
  set formDisabled(it: boolean) {
    if (it) {
      this.form.disable();
    }
  }

  ngAfterViewInit(): void {
    if (this.isCreating()) {
      this.setInputFocus();
    }
  }

  protected overrideRawValue(value: typeof this.form.value): unknown {
    return value;
  }

  private setInputFocus(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const input = this.formRef()?.nativeElement.querySelector(focuses.join(','));
    if (input) {
      input.focus();
      this.lumber.log('setInputFocus', 'Input to focus', input);
    } else {
      this.lumber.log('setInputFocus', 'No input found to focus');
    }
  }

  submit(): void {
    const formValue = this.overrideRawValue(this.form.getRawValue());
    if (this.isCreating()) {
      this.submitCreate.emit(formValue as CreateDTOType);
      return;
    }
    this.submitUpdate.emit(formValue as UpdateDTOType);
  }

  reset(): void {
    this.form.reset();
    this.setInputFocus();
  }

  patchValue<
    TControl extends {
      [K in keyof TControl]: AbstractControl<unknown>;
    } = object,
  >(value: ɵFormGroupValue<TControl>): void {
    this.form.patchValue(value);
  }
}
