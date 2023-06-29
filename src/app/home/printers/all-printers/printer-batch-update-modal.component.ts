import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {n_from, s_from} from 'dfts-helper';
import {AComponent} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {debounceTime} from 'rxjs';
import {PrintersService} from '../_services/printers.service';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-printer-batch-update-title">{{ 'HOME_PRINTER_BATCH_UPDATE_TITLE' | tr }}</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.close()"></button>
    </div>
    <div class="modal-body">
      <ng-container *ngIf="formValueChanges | async" />

      <form [formGroup]="form" class="row row-cols-1 row-cols-lg-2 g-3">
        <div>
          <div class="form-group">
            <label for="fontScale">{{ 'HOME_PRINTER_FONT_SCALE' | tr }}</label>
            <input
              class="form-control bg-dark text-white"
              type="number"
              id="fontScale"
              formControlName="fontScale"
              placeholder="{{ 'HOME_PRINTER_FONT_SCALE' | tr }}"
            />

            <small *ngIf="form.controls.fontScale.invalid" class="text-danger">
              {{ 'HOME_PRINTER_FONT_SCALE_INVALID' | tr }}
            </small>
          </div>

          <div class="form-check form-switch mt-1">
            <input formControlName="updateFontScale" class="form-check-input" type="checkbox" role="switch" id="updateFontScale" />
            <label class="form-check-label" for="updateFontScale"
              >{{ 'HOME_PRINTER_FONT_SCALE' | tr }} {{ 'HOME_PRINTER_BATCH_UPDATE_CHANGE' | tr }}</label
            >
          </div>
        </div>

        <div>
          <div class="form-group" *ngIf="availableFonts$ | async as availableFonts">
            <label for="font">{{ 'HOME_PRINTER_FONT' | tr }}</label>

            <select class="form-select bg-dark text-white" aria-label="Font select" id="font" formControlName="font">
              <option *ngFor="let font of availableFonts" [value]="font.code">{{ font.description }}</option>
            </select>
          </div>
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
              class="form-control bg-dark text-white"
              type="number"
              id="bonWidth"
              formControlName="bonWidth"
              placeholder="{{ 'HOME_PRINTER_BON_WIDTH' | tr }}"
            />

            <small *ngIf="form.controls.bonWidth.invalid" class="text-danger">
              {{ 'HOME_PRINTER_BON_WIDTH_INVALID' | tr }}
            </small>
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
              class="form-control bg-dark text-white"
              type="number"
              id="bonPadding"
              formControlName="bonPadding"
              placeholder="{{ 'HOME_PRINTER_BON_PADDING' | tr }}"
            />

            <small *ngIf="form.controls.bonPadding.invalid" class="text-danger">
              {{ 'HOME_PRINTER_BON_PADDING_INVALID' | tr }}
            </small>
          </div>
          <div class="form-check form-switch mt-1">
            <input formControlName="updateBonPadding" class="form-check-input" type="checkbox" role="switch" id="updateBonPadding" />
            <label class="form-check-label" for="updateBonPadding"
              >{{ 'HOME_PRINTER_BON_PADDING' | tr }} {{ 'HOME_PRINTER_BATCH_UPDATE_CHANGE' | tr }}</label
            >
          </div>
        </div>

        <small
          *ngIf="
            !form.controls.updateFont.value &&
            !form.controls.updateFontScale.value &&
            !form.controls.updateBonWidth.value &&
            !form.controls.updateBonPadding.value
          "
          class="text-danger"
        >
          {{ 'HOME_PRINTER_BATCH_UPDATE_INVALID' | tr }}
        </small>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
      <button
        type="submit"
        class="btn btn-warning"
        (click)="submit()"
        [disabled]="
          !form.controls.updateFont.value &&
          !form.controls.updateFontScale.value &&
          !form.controls.updateBonWidth.value &&
          !form.controls.updateBonPadding.value
        "
      >
        {{ 'SAVE' | tr }}
      </button>
    </div>
  `,
  selector: 'app-printer-batch-update-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTr, ReactiveFormsModule, NgIf, AsyncPipe, NgForOf],
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
    fontScale: [1, [Validators.required, Validators.min(0.5), Validators.max(2.5)]],
    font: ['H', [Validators.required, Validators.minLength(1)]],
    bonWidth: [80, [Validators.required, Validators.min(60), Validators.max(160)]],
    bonPadding: [5, [Validators.required, Validators.min(0), Validators.max(10)]],
  });

  formValueChanges = this.form.valueChanges.pipe(debounceTime(300));

  constructor(public activeModal: NgbActiveModal) {
    super();

    this.form.controls.fontScale.disable();
    this.form.controls.font.disable();
    this.form.controls.bonWidth.disable();
    this.form.controls.bonPadding.disable();

    this.unsubscribe(
      this.form.controls.updateFontScale.valueChanges.subscribe((value) =>
        value ? this.form.controls.fontScale.enable() : this.form.controls.fontScale.disable()
      ),
      this.form.controls.updateFont.valueChanges.subscribe((value) =>
        value ? this.form.controls.font.enable() : this.form.controls.font.disable()
      ),
      this.form.controls.updateBonWidth.valueChanges.subscribe((value) =>
        value ? this.form.controls.bonWidth.enable() : this.form.controls.bonWidth.disable()
      ),
      this.form.controls.updateBonPadding.valueChanges.subscribe((value) =>
        value ? this.form.controls.bonPadding.enable() : this.form.controls.bonPadding.disable()
      )
    );
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
    };
    this.activeModal.close(dto);
  }
}

export type PrinterBatchUpdateDto = {
  font?: string;
  fontScale?: number;
  bonWidth?: number;
  bonPadding?: number;
};
