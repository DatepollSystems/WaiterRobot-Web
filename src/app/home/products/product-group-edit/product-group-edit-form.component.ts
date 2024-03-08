import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {AppColorPicker} from '@home-shared/components/color/color-picker.component';
import {AbstractModelEditFormComponent} from '@home-shared/form/abstract-model-edit-form.component';
import {AppModelEditSaveBtn} from '@home-shared/form/app-model-edit-save-btn.component';
import {allowedCharacterSet} from '@home-shared/regex';
import {TranslocoPipe} from '@ngneat/transloco';

import {injectIsValid} from '@shared/form';
import {CreateProductGroupDto, GetProductGroupResponse, UpdateProductGroupDto} from '@shared/waiterrobot-backend';

import {HasNumberIDAndName} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';

import {startWith} from 'rxjs';

@Component({
  template: `
    @if (isValid()) {}

    <form #formRef [formGroup]="form" (ngSubmit)="submit()">
      <div class="d-flex flex-column flex-md-row gap-4 mb-4">
        <div class="form-group col">
          <label for="name">{{ 'NAME' | transloco }}</label>
          <input class="form-control" type="text" id="name" formControlName="name" [placeholder]="'NAME' | transloco" />

          @if (form.controls.name.invalid) {
            <small class="text-danger">
              {{ 'HOME_PROD_GROUP_NAME_INCORRECT' | transloco }}
            </small>
          }
        </div>
      </div>

      <div class="d-flex flex-column flex-md-row gap-4 mb-4">
        <div class="col">
          <div class="d-flex flex-column">
            <label for="name">{{ 'COLOR' | transloco }}</label>
            <app-color-picker
              [color]="form.controls.color.getRawValue()"
              [disabled]="form.disabled"
              (colorChange)="form.controls.color.setValue($event)"
            />
          </div>
        </div>

        @if (!isCreating()) {
          <div class="col">
            <div class="form-group mb-2">
              <label for="selectPrinter">{{ 'NAV_PRINTERS' | transloco }}</label>
              <div class="input-group">
                <span class="input-group-text" id="selectPrinter-addon"><bi name="printer" /></span>
                <select class="form-select" id="selectPrinter" formControlName="printerId">
                  <option [ngValue]="-1">{{ 'HOME_PROD_PRINTER_SELECT_DEFAULT' | transloco }}</option>
                  @for (printer of this.printers; track printer.id) {
                    <option [ngValue]="printer.id">
                      {{ printer.name }}
                    </option>
                  }
                </select>
              </div>
              @if (form.controls.printerId.invalid) {
                <small class="text-danger">
                  {{ 'HOME_PROD_GROUP_ID_INCORRECT' | transloco }}
                </small>
              }
            </div>

            <div class="form-check form-switch mt-2">
              <input class="form-check-input" type="checkbox" role="switch" id="updatePrinter" formControlName="updatePrinterId" />
              <label class="form-check-label" for="updatePrinter">{{ 'HOME_PROD_GROUP_PRINTER_UPDATE' | transloco }}</label>
            </div>
          </div>
        }
      </div>

      <app-model-edit-save-btn [valid]="isValid()" [creating]="isCreating()" />
    </form>
  `,
  selector: 'app-product-group-edit-form',
  imports: [ReactiveFormsModule, TranslocoPipe, BiComponent, AppColorPicker, AppModelEditSaveBtn],
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

  isValid = injectIsValid(this.form);

  override overrideRawValue = (value: typeof this.form.value): unknown => {
    if (value.updatePrinterId === false || value.updatePrinterId === undefined || value.printerId === -1) {
      value.printerId = undefined;
    }

    return super.overrideRawValue(value);
  };

  constructor() {
    super();
    this.form.controls.updatePrinterId.valueChanges.pipe(takeUntilDestroyed(), startWith(false)).subscribe((value) => {
      if (value) {
        this.form.controls.printerId.enable();
      } else {
        this.form.controls.printerId.disable();
      }
    });
  }

  @Input()
  set productGroup(it: GetProductGroupResponse | 'CREATE') {
    if (it === 'CREATE') {
      this.isCreating.set(true);
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
