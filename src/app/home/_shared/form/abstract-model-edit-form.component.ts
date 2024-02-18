// noinspection JSNonASCIINames NonAsciiCharacters

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ɵFormGroupValue} from '@angular/forms';

import {loggerOf} from 'dfts-helper';
import {AComponent} from 'dfx-helper';

const focuses = ['input', 'select', 'textarea'];

@Component({
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractModelEditFormComponent<CreateDTOType, UpdateDTOType> extends AComponent implements AfterViewInit {
  lumber = loggerOf('AModelEditForm');

  fb = inject(FormBuilder);

  @Output()
  readonly submitCreate = new EventEmitter<CreateDTOType>();

  @Output()
  readonly submitUpdate = new EventEmitter<UpdateDTOType>();

  isCreating = signal(false);

  abstract form: FormGroup;
  @ViewChild('formRef') formRef?: ElementRef;

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
    const input = this.formRef?.nativeElement.querySelector(focuses.join(','));
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
