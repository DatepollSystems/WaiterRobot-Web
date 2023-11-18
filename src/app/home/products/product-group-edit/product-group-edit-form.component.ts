import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {startWith} from 'rxjs';

import {HasNumberIDAndName} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {allowedCharacterSet} from '../../../_shared/regex';
import {AppColorPicker} from '../../../_shared/ui/color/color-picker.component';
import {AbstractModelEditFormComponent} from '../../../_shared/ui/form/abstract-model-edit-form.component';
import {CreateProductGroupDto, GetProductGroupResponse, UpdateProductGroupDto} from '../../../_shared/waiterrobot-backend';

@Component({
  template: `
    <ng-container *ngIf="formStatusChanges | async" />

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-md-row gap-4 mb-4">
        <div class="form-group col">
          <label for="name">{{ 'NAME' | tr }}</label>
          <input class="form-control" type="text" id="name" formControlName="name" placeholder="{{ 'NAME' | tr }}" />

          @if (form.controls.name.invalid) {
            <small class="text-danger">
              {{ 'HOME_PROD_GROUP_NAME_INCORRECT' | tr }}
            </small>
          }
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-4 mb-4">
        <div class="col">
          <div class="d-flex flex-column">
            <label for="name">{{ 'COLOR' | tr }}</label>
            <app-color-picker
              [color]="form.controls.color.getRawValue()"
              (colorChange)="form.controls.color.setValue($event)"
              [disabled]="form.disabled"
            />
          </div>
        </div>

        @if (this._isEdit) {
          <div class="col">
            <div class="form-group mb-2">
              <label for="selectPrinter">{{ 'NAV_PRINTERS' | tr }}</label>
              <div class="input-group">
                <span class="input-group-text" id="selectPrinter-addon"><bi name="diagram-3" /></span>
                <select class="form-select" id="selectPrinter" formControlName="printerId">
                  <option [ngValue]="-1">{{ 'HOME_PROD_PRINTER_SELECT_DEFAULT' | tr }}</option>
                  @for (printer of this.printers; track printer.id) {
                    <option [ngValue]="printer.id">
                      {{ printer.name }}
                    </option>
                  }
                </select>
              </div>
              @if (form.controls.printerId.invalid) {
                <small class="text-danger">
                  {{ 'HOME_PROD_GROUP_ID_INCORRECT' | tr }}
                </small>
              }
            </div>

            <div class="form-check form-switch mt-2">
              <input class="form-check-input" type="checkbox" role="switch" id="updatePrinter" formControlName="updatePrinterId" />
              <label class="form-check-label" for="updatePrinter">{{ 'HOME_PROD_GROUP_PRINTER_UPDATE' | tr }}</label>
            </div>
          </div>
        }
      </div>
    </form>
  `,
  selector: 'app-product-group-edit-form',
  imports: [ReactiveFormsModule, NgIf, AsyncPipe, DfxTr, BiComponent, AppColorPicker],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductGroupEditFormComponent extends AbstractModelEditFormComponent<CreateProductGroupDto, UpdateProductGroupDto> {
  override form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60), Validators.pattern(allowedCharacterSet)]],
    color: new FormControl<string | undefined>(undefined),
    updatePrinterId: [false],
    printerId: [-1],
    eventId: [-1, [Validators.required, Validators.min(0)]],
    id: [-1],
  });

  override overrideRawValue = (value: typeof this.form.value): unknown => {
    if (value.updatePrinterId === false || value.updatePrinterId === undefined || value.printerId === -1) {
      value.printerId = undefined;
    }

    return super.overrideRawValue(value);
  };

  constructor() {
    super();
    this.unsubscribe(
      this.form.controls.updatePrinterId.valueChanges
        .pipe(startWith(false))
        .subscribe((value) => (value ? this.form.controls.printerId.enable() : this.form.controls.printerId.disable())),
    );
  }

  @Input()
  set productGroup(it: GetProductGroupResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isEdit = false;
      return;
    }

    this.form.patchValue({
      name: it.name,
      id: it.id,
      color: it.color,
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

  @Input()
  printers!: HasNumberIDAndName[];
}
