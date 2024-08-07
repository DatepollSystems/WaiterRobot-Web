import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';
import {injectIsValid} from '@shared/form';

import {n_from, s_from} from 'dfts-helper';

import {PrintersService} from './_services/printers.service';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-printer-batch-update-title">{{ 'HOME_PRINTER_BATCH_UPDATE_TITLE' | transloco }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (mousedown)="activeModal.close()"></button>
    </div>
    <div class="modal-body">
      @if (isValid()) {}

      <form class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3" [formGroup]="form">
        <div>
          <div class="form-group">
            <label for="fontScale">{{ 'HOME_PRINTER_FONT_SCALE' | transloco }}</label>
            <input
              class="form-control"
              type="number"
              id="fontScale"
              formControlName="fontScale"
              [placeholder]="'HOME_PRINTER_FONT_SCALE' | transloco"
            />

            @if (form.controls.fontScale.invalid) {
              <small class="text-danger">
                {{ 'HOME_PRINTER_FONT_SCALE_INVALID' | transloco }}
              </small>
            }
          </div>

          <div class="form-check form-switch mt-1">
            <input formControlName="updateFontScale" class="form-check-input" type="checkbox" role="switch" id="updateFontScale" />
            <label class="form-check-label" for="updateFontScale"
              >{{ 'HOME_PRINTER_FONT_SCALE' | transloco }} {{ 'HOME_PRINTER_BATCH_UPDATE_CHANGE' | transloco }}</label
            >
          </div>
        </div>

        <div>
          <div class="form-group">
            <label for="font">{{ 'HOME_PRINTER_FONT' | transloco }}</label>

            <select class="form-select" aria-label="Font select" id="font" formControlName="font">
              @for (font of availableFonts(); track font.code) {
                <option [value]="font.code">{{ font.description }}</option>
              }
            </select>
          </div>
          <div class="form-check form-switch mt-1">
            <input formControlName="updateFont" class="form-check-input" type="checkbox" role="switch" id="updateFont" />
            <label class="form-check-label" for="updateFont"
              >{{ 'HOME_PRINTER_FONT' | transloco }} {{ 'HOME_PRINTER_BATCH_UPDATE_CHANGE' | transloco }}</label
            >
          </div>
        </div>

        <div>
          <div class="form-group">
            <label for="bonWidth">{{ 'HOME_PRINTER_BON_WIDTH' | transloco }}</label>
            <input
              class="form-control"
              type="number"
              id="bonWidth"
              formControlName="bonWidth"
              [placeholder]="'HOME_PRINTER_BON_WIDTH' | transloco"
            />

            @if (form.controls.bonWidth.invalid) {
              <small class="text-danger">
                {{ 'HOME_PRINTER_BON_WIDTH_INVALID' | transloco }}
              </small>
            }
          </div>
          <div class="form-check form-switch mt-1">
            <input formControlName="updateBonWidth" class="form-check-input" type="checkbox" role="switch" id="updateBonWidth" />
            <label class="form-check-label" for="updateBonWidth"
              >{{ 'HOME_PRINTER_BON_WIDTH' | transloco }} {{ 'HOME_PRINTER_BATCH_UPDATE_CHANGE' | transloco }}</label
            >
          </div>
        </div>

        <div>
          <div class="form-group">
            <label for="bonPadding">{{ 'HOME_PRINTER_BON_PADDING' | transloco }}</label>
            <input
              class="form-control"
              type="number"
              id="bonPadding"
              formControlName="bonPadding"
              [placeholder]="'HOME_PRINTER_BON_PADDING' | transloco"
            />

            @if (form.controls.bonPadding.invalid) {
              <small class="text-danger">
                {{ 'HOME_PRINTER_BON_PADDING_INVALID' | transloco }}
              </small>
            }
          </div>
          <div class="form-check form-switch mt-1">
            <input formControlName="updateBonPadding" class="form-check-input" type="checkbox" role="switch" id="updateBonPadding" />
            <label class="form-check-label" for="updateBonPadding"
              >{{ 'HOME_PRINTER_BON_PADDING' | transloco }} {{ 'HOME_PRINTER_BATCH_UPDATE_CHANGE' | transloco }}</label
            >
          </div>
        </div>

        <div>
          <div class="form-group">
            <label for="bonPaddingTop">{{ 'HOME_PRINTER_BON_PADDING_TOP' | transloco }}</label>
            <input
              class="form-control"
              type="number"
              id="bonPaddingTop"
              formControlName="bonPaddingTop"
              [placeholder]="'HOME_PRINTER_BON_PADDING_TOP' | transloco"
            />

            @if (form.controls.bonPaddingTop.invalid) {
              <small class="text-danger">
                {{ 'HOME_PRINTER_BON_PADDING_TOP_INVALID' | transloco }}
              </small>
            }
          </div>
          <div class="form-check form-switch mt-1">
            <input formControlName="updateBonPaddingTop" class="form-check-input" type="checkbox" role="switch" id="updateBonPaddingTop" />
            <label class="form-check-label" for="updateBonPaddingTop"
              >{{ 'HOME_PRINTER_BON_PADDING_TOP' | transloco }} {{ 'HOME_PRINTER_BATCH_UPDATE_CHANGE' | transloco }}</label
            >
          </div>
        </div>
      </form>

      @if (
        !form.controls.updateFont.value &&
        !form.controls.updateFontScale.value &&
        !form.controls.updateBonWidth.value &&
        !form.controls.updateBonPadding.value &&
        !form.controls.updateBonPaddingTop.value
      ) {
        <small class="text-danger">
          {{ 'HOME_PRINTER_BATCH_UPDATE_INVALID' | transloco }}
        </small>
      }
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (mousedown)="activeModal.close()">{{ 'CLOSE' | transloco }}</button>
      <button
        type="submit"
        class="btn btn-warning"
        [disabled]="
          (!form.controls.updateFont.value &&
            !form.controls.updateFontScale.value &&
            !form.controls.updateBonWidth.value &&
            !form.controls.updateBonPadding.value &&
            !form.controls.updateBonPaddingTop.value) ||
          !form.valid
        "
        (mousedown)="submit()"
      >
        {{ 'SAVE' | transloco }}
      </button>
    </div>
  `,
  selector: 'app-printer-batch-update-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, ReactiveFormsModule],
  standalone: true,
})
export class PrintersBatchUpdateModal {
  activeModal = inject(NgbActiveModal);
  fb = inject(FormBuilder);
  printersService = inject(PrintersService);

  availableFonts = toSignal(this.printersService.getAllFonts$(), {initialValue: []});

  form = this.fb.nonNullable.group({
    updateFontScale: [false],
    updateFont: [false],
    updateBonWidth: [false],
    updateBonPadding: [false],
    updateBonPaddingTop: [false],
    fontScale: [1, [Validators.required, Validators.min(0.5), Validators.max(2.5)]],
    font: ['H', [Validators.required, Validators.minLength(1)]],
    bonWidth: [80, [Validators.required, Validators.min(60), Validators.max(160)]],
    bonPadding: [5, [Validators.required, Validators.min(0), Validators.max(10)]],
    bonPaddingTop: [null as number | null, [Validators.min(0), Validators.max(30)]],
  });

  isValid = injectIsValid(this.form);

  constructor() {
    this.form.controls.fontScale.disable();
    this.form.controls.font.disable();
    this.form.controls.bonWidth.disable();
    this.form.controls.bonPadding.disable();
    this.form.controls.bonPaddingTop.disable();

    this.form.controls.updateFontScale.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.updateFormControl(this.form.controls.fontScale, value);
    });
    this.form.controls.updateFont.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.updateFormControl(this.form.controls.font, value);
    });
    this.form.controls.updateBonWidth.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.updateFormControl(this.form.controls.bonWidth, value);
    });
    this.form.controls.updateBonPadding.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.updateFormControl(this.form.controls.bonPadding, value);
    });
    this.form.controls.updateBonPaddingTop.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.updateFormControl(this.form.controls.bonPaddingTop, value);
    });
  }

  updateFormControl(it: FormControl<unknown>, value: boolean): void {
    if (value) {
      it.enable();
    } else {
      it.disable();
      it.reset();
    }
  }

  submit(): void {
    const formValues = this.form.getRawValue();
    const match: string[] = s_from(formValues.fontScale).split(/[,.]/);
    const big = n_from(match[0] ?? 0);
    const small = n_from(match[1] ?? 0);
    formValues.fontScale = big * 10 + small;

    const dto: PrinterBatchUpdateDto = {
      font: formValues.updateFont ? formValues.font : undefined,
      fontScale: formValues.updateFontScale ? formValues.fontScale : undefined,
      bonWidth: formValues.updateBonWidth ? formValues.bonWidth : undefined,
      bonPadding: formValues.updateBonPadding ? formValues.bonPadding : undefined,
      bonPaddingTop: formValues.updateBonPaddingTop ? formValues.bonPaddingTop : undefined,
    };
    this.activeModal.close(dto);
  }
}

export interface PrinterBatchUpdateDto {
  font?: string;
  fontScale?: number;
  bonWidth?: number;
  bonPadding?: number;
  bonPaddingTop?: number | null;
}
