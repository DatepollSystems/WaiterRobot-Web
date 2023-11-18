import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {debounceTime} from 'rxjs';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {n_from, s_from} from 'dfts-helper';
import {AComponent} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {PrintersService} from '../_services/printers.service';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-printer-batch-update-title">{{ 'HOME_PRINTER_BATCH_UPDATE_TITLE' | tr }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.close()"></button>
    </div>
    <div class="modal-body">
      <ng-container *ngIf="formValueChanges | async" />

      <form [formGroup]="form" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
        <div>
          <div class="form-group">
            <label for="fontScale">{{ 'HOME_PRINTER_FONT_SCALE' | tr }}</label>
            <input
              class="form-control"
              type="number"
              id="fontScale"
              formControlName="fontScale"
              placeholder="{{ 'HOME_PRINTER_FONT_SCALE' | tr }}"
            />

            @if (form.controls.fontScale.invalid) {
              <small class="text-danger">
                {{ 'HOME_PRINTER_FONT_SCALE_INVALID' | tr }}
              </small>
            }
          </div>

          <div class="form-check form-switch mt-1">
            <input formControlName="updateFontScale" class="form-check-input" type="checkbox" role="switch" id="updateFontScale" />
            <label class="form-check-label" for="updateFontScale"
              >{{ 'HOME_PRINTER_FONT_SCALE' | tr }} {{ 'HOME_PRINTER_BATCH_UPDATE_CHANGE' | tr }}</label
            >
          </div>
        </div>

        <div>
          @if (availableFonts$ | async; as availableFonts) {
            <div class="form-group">
              <label for="font">{{ 'HOME_PRINTER_FONT' | tr }}</label>

              <select class="form-select" aria-label="Font select" id="font" formControlName="font">
                @for (font of availableFonts; track font.code) {
                  <option [value]="font.code">{{ font.description }}</option>
                }
              </select>
            </div>
          }
          <div class="form-check form-switch mt-1">
            <input formControlName="updateFont" class="form-check-input" type="checkbox" role="switch" id="updateFont" />
            <label class="form-check-label" for="updateFont"
              >{{ 'HOME_PRINTER_FONT' | tr }} {{ 'HOME_PRINTER_BATCH_UPDATE_CHANGE' | tr }}</label
            >
          </div>
        </div>

        <div>
          <div class="form-group">
            <label for="bonWidth">{{ 'HOME_PRINTER_BON_WIDTH' | tr }}</label>
            <input
              class="form-control"
              type="number"
              id="bonWidth"
              formControlName="bonWidth"
              placeholder="{{ 'HOME_PRINTER_BON_WIDTH' | tr }}"
            />

            @if (form.controls.bonWidth.invalid) {
              <small class="text-danger">
                {{ 'HOME_PRINTER_BON_WIDTH_INVALID' | tr }}
              </small>
            }
          </div>
          <div class="form-check form-switch mt-1">
            <input formControlName="updateBonWidth" class="form-check-input" type="checkbox" role="switch" id="updateBonWidth" />
            <label class="form-check-label" for="updateBonWidth"
              >{{ 'HOME_PRINTER_BON_WIDTH' | tr }} {{ 'HOME_PRINTER_BATCH_UPDATE_CHANGE' | tr }}</label
            >
          </div>
        </div>

        <div>
          <div class="form-group">
            <label for="bonPadding">{{ 'HOME_PRINTER_BON_PADDING' | tr }}</label>
            <input
              class="form-control"
              type="number"
              id="bonPadding"
              formControlName="bonPadding"
              placeholder="{{ 'HOME_PRINTER_BON_PADDING' | tr }}"
            />

            @if (form.controls.bonPadding.invalid) {
              <small class="text-danger">
                {{ 'HOME_PRINTER_BON_PADDING_INVALID' | tr }}
              </small>
            }
          </div>
          <div class="form-check form-switch mt-1">
            <input formControlName="updateBonPadding" class="form-check-input" type="checkbox" role="switch" id="updateBonPadding" />
            <label class="form-check-label" for="updateBonPadding"
              >{{ 'HOME_PRINTER_BON_PADDING' | tr }} {{ 'HOME_PRINTER_BATCH_UPDATE_CHANGE' | tr }}</label
            >
          </div>
        </div>

        <div>
          <div class="form-group">
            <label for="bonPaddingTop">{{ 'HOME_PRINTER_BON_PADDING_TOP' | tr }}</label>
            <input
              class="form-control"
              type="number"
              id="bonPaddingTop"
              formControlName="bonPaddingTop"
              placeholder="{{ 'HOME_PRINTER_BON_PADDING_TOP' | tr }}"
            />

            @if (form.controls.bonPaddingTop.invalid) {
              <small class="text-danger">
                {{ 'HOME_PRINTER_BON_PADDING_TOP_INVALID' | tr }}
              </small>
            }
          </div>
          <div class="form-check form-switch mt-1">
            <input formControlName="updateBonPaddingTop" class="form-check-input" type="checkbox" role="switch" id="updateBonPaddingTop" />
            <label class="form-check-label" for="updateBonPaddingTop"
              >{{ 'HOME_PRINTER_BON_PADDING_TOP' | tr }} {{ 'HOME_PRINTER_BATCH_UPDATE_CHANGE' | tr }}</label
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
          {{ 'HOME_PRINTER_BATCH_UPDATE_INVALID' | tr }}
        </small>
      }
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
      <button
        type="submit"
        class="btn btn-warning"
        (click)="submit()"
        [disabled]="
          (!form.controls.updateFont.value &&
            !form.controls.updateFontScale.value &&
            !form.controls.updateBonWidth.value &&
            !form.controls.updateBonPadding.value &&
            !form.controls.updateBonPaddingTop.value) ||
          !form.valid
        "
      >
        {{ 'SAVE' | tr }}
      </button>
    </div>
  `,
  selector: 'app-printer-batch-update-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTr, ReactiveFormsModule, NgIf, AsyncPipe],
  standalone: true,
})
export class PrinterBatchUpdateModalComponent extends AComponent {
  fb = inject(FormBuilder);
  printersService = inject(PrintersService);

  availableFonts$ = this.printersService.getAllFonts$();

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

  formValueChanges = this.form.valueChanges.pipe(debounceTime(300));

  constructor(public activeModal: NgbActiveModal) {
    super();

    this.form.controls.fontScale.disable();
    this.form.controls.font.disable();
    this.form.controls.bonWidth.disable();
    this.form.controls.bonPadding.disable();
    this.form.controls.bonPaddingTop.disable();

    this.unsubscribe(
      this.form.controls.updateFontScale.valueChanges.subscribe((value) => this.updateFormControl(this.form.controls.fontScale, value)),
      this.form.controls.updateFont.valueChanges.subscribe((value) => this.updateFormControl(this.form.controls.font, value)),
      this.form.controls.updateBonWidth.valueChanges.subscribe((value) => this.updateFormControl(this.form.controls.bonWidth, value)),
      this.form.controls.updateBonPadding.valueChanges.subscribe((value) => this.updateFormControl(this.form.controls.bonPadding, value)),
      this.form.controls.updateBonPaddingTop.valueChanges.subscribe((value) =>
        this.updateFormControl(this.form.controls.bonPaddingTop, value),
      ),
    );
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

export type PrinterBatchUpdateDto = {
  font?: string;
  fontScale?: number;
  bonWidth?: number;
  bonPadding?: number;
  bonPaddingTop?: number | null;
};
