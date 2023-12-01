import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';

import {n_from, s_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {AbstractModelEditFormComponent} from '../../_shared/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '../../_shared/form/app-model-edit-save-btn.component';
import {injectIsValid} from '../../../_shared/form';
import {CreatePrinterDto, GetPrinterFontResponse, GetPrinterResponse, UpdatePrinterDto} from '../../../_shared/waiterrobot-backend';
import {allowedCharacterSet} from '../../_shared/regex';

@Component({
  template: `
    @if (isValid()) {}

    <form #formRef [formGroup]="form" (ngSubmit)="submit()" class="d-flex flex-column gap-3">
      <div class="d-flex flex-column flex-lg-row gap-4">
        <div class="flex-fill form-group">
          <label for="name">{{ 'NAME' | tr }}</label>
          <input class="form-control" type="text" id="name" formControlName="name" placeholder="{{ 'NAME' | tr }}" />

          @if (form.controls.name.invalid) {
            <small class="text-danger">
              {{ 'HOME_PRINTER_NAME_INCORRECT' | tr }}
            </small>
          }
        </div>
        <div class="flex-fill form-group">
          <label for="fontScale">{{ 'HOME_PRINTER_FONT_SCALE' | tr }}</label>
          <input
            class="form-control"
            type="number"
            id="fontScale"
            step="0.1"
            formControlName="fontScale"
            placeholder="{{ 'HOME_PRINTER_FONT_SCALE' | tr }}"
          />

          @if (form.controls.fontScale.invalid) {
            <small class="text-danger">
              {{ 'HOME_PRINTER_FONT_SCALE_INVALID' | tr }}
            </small>
          }
        </div>

        <div class="flex-fill form-group">
          <label for="font">{{ 'HOME_PRINTER_FONT' | tr }}</label>

          <select class="form-select" aria-label="Font select" id="font" formControlName="font">
            @for (font of availableFonts; track font.code) {
              <option [value]="font.code">{{ font.description }}</option>
            }
          </select>
        </div>
      </div>

      <div class="d-flex flex-column flex-lg-row justify-content-between gap-4">
        <div class="flex-fill form-group">
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

        <div class="flex-fill form-group">
          <label for="bonPadding">{{ 'HOME_PRINTER_BON_PADDING' | tr }}</label>
          <input
            class="form-control"
            type="number"
            id="bonPadding"
            step="1"
            formControlName="bonPadding"
            placeholder="{{ 'HOME_PRINTER_BON_PADDING' | tr }}"
          />

          @if (form.controls.bonPadding.invalid) {
            <small class="text-danger">
              {{ 'HOME_PRINTER_BON_PADDING_INVALID' | tr }}
            </small>
          }
        </div>

        <div class="flex-fill form-group">
          <label for="bonPaddingTop">{{ 'HOME_PRINTER_BON_PADDING_TOP' | tr }}</label>
          <input
            class="form-control"
            type="number"
            step="1"
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
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-printer-edit-form',
  imports: [ReactiveFormsModule, AsyncPipe, DfxTr, BiComponent, AppModelEditSaveBtn],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPrinterEditForm extends AbstractModelEditFormComponent<CreatePrinterDto, UpdatePrinterDto> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(120), Validators.pattern(allowedCharacterSet)]],
    fontScale: [1, [Validators.required, Validators.min(0.5), Validators.max(2.5)]],
    font: ['H', [Validators.required, Validators.minLength(1)]],
    bonWidth: [80, [Validators.required, Validators.min(60), Validators.max(160)]],
    bonPadding: [5, [Validators.required, Validators.min(0), Validators.max(10)]],
    bonPaddingTop: [null as number | null, [Validators.min(0), Validators.max(30)]],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    id: [-1],
  });

  isValid = injectIsValid(this.form);

  override overrideRawValue = (value: typeof this.form.value): unknown => {
    this.lumber.info('overrideRawValue', 'Scale', value.fontScale);
    const match: string[] = s_from(value.fontScale).split(/[,.]/);
    const big = n_from(match[0] ?? 1);
    const small = n_from(match[1] ? match[1][0] ?? 0 : 0);

    value.fontScale = big * 10 + small;

    this.lumber.log('overrideRawValue', 'Scale', match, value.fontScale);

    return super.overrideRawValue(value);
  };

  @Input()
  set printer(it: GetPrinterResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
      return;
    }

    this.form.setValue({
      name: it.name,
      fontScale: it.fontScale,
      font: it.font.code,
      bonWidth: it.bonWidth,
      bonPadding: it.bonPadding,
      bonPaddingTop: it.bonPaddingTop ?? null,
      eventId: it.eventId,
      id: it.id,
    });
  }

  @Input()
  set selectedEventId(id: number | undefined) {
    if (id) {
      this._selectedEventId = id;
      this.form.controls.eventId.setValue(this._selectedEventId);
    }
  }
  _selectedEventId = -1;

  @Input({required: true})
  availableFonts!: GetPrinterFontResponse[];
}
