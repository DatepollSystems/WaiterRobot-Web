import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReactiveFormsModule, Validators} from '@angular/forms';

import {n_from, s_from} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {allowedCharacterSet} from '../../../_shared/regex';
import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {CreatePrinterDto, GetPrinterFontResponse, GetPrinterResponse, UpdatePrinterDto} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <ng-container *ngIf="formStatusChanges | async" />

    <form #formRef [formGroup]="form" (ngSubmit)="submit()" class="d-flex flex-column gap-3">
      <div class="form-group">
        <label for="name">{{ 'NAME' | tr }}</label>
        <input class="form-control bg-dark text-white" type="text" id="name" formControlName="name" placeholder="{{ 'NAME' | tr }}" />

        <small *ngIf="form.controls.name.invalid" class="text-danger">
          {{ 'HOME_PRINTER_NAME_INCORRECT' | tr }}
        </small>
      </div>

      <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
        <div class="col form-group">
          <label for="fontScale">{{ 'HOME_PRINTER_FONT_SCALE' | tr }}</label>
          <input
            class="form-control bg-dark text-white"
            type="number"
            id="fontScale"
            step="0.1"
            formControlName="fontScale"
            placeholder="{{ 'HOME_PRINTER_FONT_SCALE' | tr }}"
          />

          <small *ngIf="form.controls.fontScale.invalid" class="text-danger">
            {{ 'HOME_PRINTER_FONT_SCALE_INVALID' | tr }}
          </small>
        </div>

        <div class="col form-group">
          <label for="font">{{ 'HOME_PRINTER_FONT' | tr }}</label>

          <select class="form-select bg-dark text-white" aria-label="Font select" id="font" formControlName="font">
            <option *ngFor="let font of availableFonts" [value]="font.code">{{ font.description }}</option>
          </select>
        </div>

        <div class="col form-group">
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

        <div class="col form-group">
          <label for="bonPadding">{{ 'HOME_PRINTER_BON_PADDING' | tr }}</label>
          <input
            class="form-control bg-dark text-white"
            type="number"
            id="bonPadding"
            step="1"
            formControlName="bonPadding"
            placeholder="{{ 'HOME_PRINTER_BON_PADDING' | tr }}"
          />

          <small *ngIf="form.controls.bonPadding.invalid" class="text-danger">
            {{ 'HOME_PRINTER_BON_PADDING_INVALID' | tr }}
          </small>
        </div>

        <div class="col form-group">
          <label for="bonPaddingTop">{{ 'HOME_PRINTER_BON_PADDING_TOP' | tr }}</label>
          <input
            class="form-control bg-dark text-white"
            type="number"
            step="1"
            id="bonPaddingTop"
            formControlName="bonPaddingTop"
            placeholder="{{ 'HOME_PRINTER_BON_PADDING_TOP' | tr }}"
          />

          <small *ngIf="form.controls.bonPaddingTop.invalid" class="text-danger">
            {{ 'HOME_PRINTER_BON_PADDING_TOP_INVALID' | tr }}
          </small>
        </div>
      </div>
    </form>
  `,
  selector: 'app-printer-edit-form',
  imports: [ReactiveFormsModule, NgIf, NgForOf, AsyncPipe, DfxTr, DfxTrackById, BiComponent],
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
      this.isEdit = false;
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
